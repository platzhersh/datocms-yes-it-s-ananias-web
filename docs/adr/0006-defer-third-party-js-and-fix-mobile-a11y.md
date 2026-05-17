# 6. Defer Third-Party JS, Prioritize the LCP Image, and Fix Mobile A11y

Date: 2026-05-17

## Status

Accepted (implemented 2026-05-17 across commits 742ce01 → d9279e4)

## Context

A Lighthouse mobile audit of the Netlify preview returned a Performance
score of **40** with the following metrics:

- First Contentful Paint: 0.8 s (green)
- Largest Contentful Paint: **5.3 s** (red)
- Time to Interactive: **13.5 s** (red)
- Total Blocking Time: **1,570 ms** (red)
- Speed Index: **6.1 s** (red)
- Cumulative Layout Shift: 0.011 (green)

The "Reduce unused JavaScript" finding alone estimated 3.1 s of
potential savings. Inspection of the failing payloads identified two
dominant offenders, both loading on the critical path of the home
route:

1. **Spotify embed** — `embed-cdn.spotifycdn.com` shipped ~580 KiB of
   JS across six chunks (`3632`, `c4f29680`, `4143`, `_app`,
   `framework`, `main`). `src/components/molecules/SpotifyEmbed/SpotifyEmbed.jsx`
   was imported directly by `features/Home.jsx` and rendered eagerly.
   The iframe carried `loading="lazy"`, but on a mobile viewport the
   embed sits close enough to the fold that the browser still elected
   to fetch it, so the lazy hint had no effect on the audit.
2. **Google Tag Manager** — `gtm.js` (~117 KiB) and `gtag/js` (~148 KiB)
   were pulled in synchronously by `src/index.tsx`, which called
   `initGtm()` _before_ `createRoot().render()`. This put ~265 KiB of
   third-party JS on the boot path, competing with React for the main
   thread during TTI.

A third, smaller finding ("Avoid serving legacy JavaScript", 0.18 s)
came from our own bundle being transpiled below the level our actual
target browsers need: `vite.config.js` set no explicit `build.target`,
so Vite fell back to its `modules` default and emitted polyfilled
syntax we no longer need.

The featured release cover (`molecules/ReleaseCard/ReleaseCard.jsx`,
rendered via `molecules/FeaturedContent/FeaturedContent.tsx`) is the
LCP element on the home route. The `react-datocms` `<Image>` component
exposes a `priority` boolean that disables lazy loading and emits
`fetchpriority="high"`; we weren't using it.

The same audit's Accessibility tab reported three failures on the home
route:

- **Buttons do not have an accessible name** (three failing elements):
  the Spotify/YouTube/Purchase action buttons inside release cards.
- **Links do not have a discernible name** (three failing elements):
  the same elements' wrapping `<a>` tags.
- **Heading elements are not in a sequentially-descending order**:
  `molecules/VideoCard/VideoCard.jsx` rendered the video title as
  `<h3>` directly beneath the `<h1>` "Featured Videos" section header
  in `FeaturedContent.tsx`, skipping `<h2>`.

Both of the first two findings shared a single root cause in
`molecules/ActionButtonMediaLink/ActionButtonMediaLink.jsx`: the
visible link text was hidden on viewports ≤ 500 px with `display: none`,
which also removed it from the accessibility tree, leaving the button
and its wrapping anchor with only a FontAwesome icon and no name.

The remaining Lighthouse opportunities ("Reduce initial server response
time" — 710 ms TTFB on the Netlify preview; "Serve static assets with
an efficient cache policy" against `i.ytimg.com` thumbnails) are
third-party or platform-side and not addressable from code.

## Decision

Four changes, landed in two commits so the perf and a11y work can be
bisected separately:

1. **Defer the Spotify embed until it's near the viewport.** Refactor
   `SpotifyEmbed.jsx` to mount the `<iframe>` only after an
   `IntersectionObserver` reports the container is within 400 px of the
   viewport. A 380 px-tall placeholder `<div>` is rendered until then,
   matching the iframe's reserved height so the CLS budget is
   unaffected. When `IntersectionObserver` is unavailable (legacy
   browsers, SSR-like environments), fall back to mounting
   immediately so the embed is never silently absent.

   The visible behaviour is unchanged for any user who scrolls toward
   the player. The audit run never scrolls, so the ~580 KiB Spotify
   payload is excluded from the measured critical path.

2. **Defer GTM initialization to idle time.** Move the `initGtm()`
   call in `src/index.tsx` to _after_ `root.render()`, and schedule it
   via `window.requestIdleCallback(initGtm, { timeout: 4000 })` with a
   `window.setTimeout(initGtm, 2000)` fallback for browsers that
   don't expose `requestIdleCallback`. The 4 s `timeout` and 2 s
   fallback both guarantee GTM eventually fires for analytics
   continuity, but neither blocks first paint.

3. **Set `build.target: 'es2022'` in `vite.config.js`.** Aligns the
   emitted JS with the browsers we actually support and removes the
   "Avoid serving legacy JavaScript" finding for our own bundle. The
   small slice that came from Spotify CDN chunks is moot now that
   those chunks are deferred.

4. **Mark the LCP image as priority.** Add an opt-in `priority`
   boolean prop to `ReleaseCard.jsx` (defaulting to `false`) and pass
   `priority` from `FeaturedContent.tsx` when rendering the single
   featured release. The prop forwards to `react-datocms`'s `<Image>`,
   which disables lazy loading and adds `fetchpriority="high"` to the
   image element. Other consumers (`features/Releases.jsx`) continue
   to render lazily by default — they're below the fold.

For accessibility, two further changes:

5. **Replace `display: none` with a visually-hidden style** in
   `ActionButtonMediaLink.jsx`. Below 500 px, the label remains in the
   DOM and accessibility tree but is positioned off-screen with the
   standard SR-only pattern (`position: absolute; width: 1px;
   height: 1px; margin: -1px; clip: rect(0,0,0,0); overflow: hidden`).
   The visual layout is unchanged on every viewport; the link and
   button now have accessible names at all sizes.

6. **Promote `VideoCard`'s title from `<h3>` to `<h2>`.** Matches
   `ReleaseCard`'s heading level and keeps the document outline
   sequential under the `<h1>` "Featured Videos" / "Featured Release"
   section headers in `FeaturedContent`.

The two `IntersectionObserver` + `requestIdleCallback` patterns were
chosen over alternatives:

- A "click to load" facade for Spotify (à la `react-lite-youtube-embed`)
  would have shaved the same bytes from the audit, but at the cost of
  requiring user interaction before any music could be played. Lazy
  mounting via intersection preserves the auto-play UX for scrolling
  users.
- A web worker for GTM (`partytown`) was considered for the analytics
  defer but rejected as overkill: the `requestIdleCallback` approach
  is a 10-line change with no new dependency, and GTM's main-thread
  cost after initialization is minimal — it's the boot-time fetch +
  parse that hurt TTI.

## Consequences

**Measured Lighthouse result** (same Netlify preview, mobile profile):

- Performance: **40 → 71** (+31 points)
- Accessibility: **87 → 86** (statistically flat; the +1/–1 swing came
  from a separate "color contrast" finding outside this branch's scope)
- The "Buttons do not have an accessible name", "Links do not have a
  discernible name", and "Heading elements are not in sequentially-
  descending order" failures all drop off the audit.

The remaining "Reduce unused JavaScript" finding (0.79 s) is now down
to the GTM scripts themselves (~130 KiB combined potential savings) and
our own `index-*.js` (~50 KiB). Neither is addressable without either
dropping GTM entirely or splitting the app bundle more aggressively
via `manualChunks` — the latter rearranges bytes without reducing
total transfer on a cold visit, so it's been deferred until repeat-
visit caching becomes a priority.

The remaining "Reduce initial server response time" finding (0.75 s,
850 ms TTFB on the preview URL) is Netlify cold-cache and should
warm up on production traffic. If it persists in real-user metrics,
the next lever is pre-rendering the SPA (via `vite-plugin-prerender`
or migrating to a meta-framework), which is outside this ADR's scope.

The `IntersectionObserver` fallback path in `SpotifyEmbed.jsx` means
the embed will always render in environments without it — there is no
silent regression where the player vanishes. The 380 px placeholder
matches the iframe height exactly, so the layout is identical before
and after mount.

Existing callers of `ReleaseCard` (`features/Releases.jsx`) are
unaffected by the new `priority` prop — it defaults to `false`, which
is the previous behaviour. Storybook stories for `ReleaseCard` (if any
are added later) should pass `priority={false}` or omit the prop.

The `es2022` build target rules out Safari < 16.4, Chrome < 94,
Firefox < 93, and Edge < 94. The site's analytics show effectively
zero traffic from below those thresholds; if a long-tail regression
surfaces, the revert is a one-line change to `vite.config.js`.

The `<h3>` → `<h2>` promotion in `VideoCard` changes the visual size
of the video title slightly (browser defaults render `<h2>` larger
than `<h3>`). On inspection in Storybook the difference is absorbed
by the existing `ItemContainer` padding and is consistent with how
`ReleaseCard`'s title already renders. No CSS adjustment was needed.
