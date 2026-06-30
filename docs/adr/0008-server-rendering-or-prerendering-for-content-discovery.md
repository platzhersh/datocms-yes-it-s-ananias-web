# 8. Server-Rendering or Prerendering for Content Discovery

Date: 2026-06-30

## Status

Proposed

This is a decision record drafted to evaluate options; nothing here is
implemented. It exists so the trade-offs are captured before any work
starts. ADR-0007 shipped the static identity signals; this ADR is
about the remaining gap it explicitly left open — exposing per-route
**content** to clients that do not run JavaScript.

## Context

ADR-0007 added static identity signals (meta tags, `MusicGroup`
JSON-LD, `<noscript>`, `robots.txt`, `sitemap.xml`, `llms.txt`) but
called out one boundary it could not cross: the actual page content —
the release list, the discography, the music videos, the show dates,
the About bio — exists only after React boots and Apollo resolves its
DatoCMS queries in the browser. A crawler that fetches raw HTML without
executing JavaScript sees the shell and the `<noscript>` summary, never
the records.

Concretely, the rendering today (see `docs/deployment.md`):

- `index.html` → `src/index.tsx` mounts React into `#root`.
- Routing is **Wouter** (`src/components/App.tsx`), a tiny client-side
  router. Routes: `/`, `/about`, `/releases`, `/videos`, `/shows`,
  `/discography`.
- Data is fetched **at runtime, in the browser**, by `@apollo/client`
  against `https://graphql.datocms.com`, wrapped in the `QueryLoader`
  organism. There is no build-time data step and no codegen.
- Hosting is **Netlify static publish** of `build/`, with a catch-all
  `/* → /index.html` rewrite so client routes resolve. DatoCMS is
  **not** webhooked to Netlify, so content edits do not trigger a
  rebuild — they simply appear on the next page load because fetching
  is live.
- Styling uses **styled-components + Emotion**, both of which need
  their SSR/extraction story handled if we render on a server.

Two distinct capabilities are sometimes conflated; we want to be
precise about which one we need:

- **SSG (static generation / prerendering):** produce one static HTML
  file per route at build time, with content baked in. Cheap to host
  (still just static files on Netlify). Content is as fresh as the last
  build, so it needs a rebuild trigger when DatoCMS changes.
- **SSR (server-side rendering):** render HTML per request on a server
  (or edge function). Always fresh, but requires a running server
  runtime (Netlify Functions/Edge) and is more operational surface.

For this site — a small artist site whose content changes on the order
of "a new show or release every few weeks" — **SSG with a rebuild
hook is the right target**, not per-request SSR. The only content with
any time-sensitivity is the show list, and even that is not
minute-fresh. Full SSR buys freshness we do not need at the cost of a
server runtime we do not currently operate.

## Decision

**Proposed:** introduce build-time prerendering of the six known routes
so each is served as content-complete static HTML, and trigger rebuilds
from DatoCMS so the static content stays current. Keep Netlify static
hosting; do not adopt per-request SSR.

The harder sub-question is *how* to prerender given Wouter routing and
runtime Apollo fetching. Four options were evaluated.

### Option A — Headless-browser snapshot at build (recommended first step)

Run the production build, serve it locally, drive a headless Chromium
over each of the six routes, wait for Apollo to settle, and write the
resulting DOM to a per-route `*.html`. Tools: `react-snap` (post-build,
Puppeteer-based, zero app changes but lightly maintained) or the
`@prerenderer/*` family (the actively maintained successor), wired as a
post-`vite build` step.

- **App changes:** essentially none. Wouter, Apollo and the components
  are untouched — the snapshot executes the real app exactly as a
  browser would, so whatever renders is what gets frozen.
- **Data:** captured for free — the headless browser performs the live
  DatoCMS queries during the snapshot, so the baked HTML reflects
  current content with no build-time data wiring or codegen.
- **Hydration:** the snapshot can also serialize the Apollo cache into
  the page so the client hydrates from it instead of re-fetching.
  Styled-components/Emotion need their styles serialized into the
  snapshot (both support this); this is the main thing to verify, as a
  mismatch causes a hydration warning or a flash of unstyled content.
- **Hosting:** change `netlify.toml` so each route serves its own
  prerendered file (the catch-all `/* → /index.html` rewrite must
  become more specific, or rely on Netlify serving `/releases.html`
  for `/releases`), with the SPA catch-all retained only for unknown
  paths.
- **Cost/risk:** lowest-effort path to closing the content gap.
  Downsides: adds a Puppeteer/Chromium build dependency (slower CI),
  `react-snap` is not actively maintained (prefer `@prerenderer`), and
  snapshot-based hydration is fiddlier than a framework's first-class
  SSR.

### Option B — Vike (Vite-native SSG)

Adopt [Vike](https://vike.dev/pre-rendering) (formerly
`vite-plugin-ssr`), which stays within Vite and renders pages to HTML
at build time (`vike build` → static `.html` in `dist/client/`).

- **App changes:** moderate-to-large. Vike brings its own
  filesystem-based routing and page/data conventions, so the Wouter
  router would be replaced and each route reworked into a Vike page
  with an `+data` loader. Apollo would run at build time via Vike's
  data hooks (or Apollo's `getDataFromTree`), which means moving the
  `QueryLoader`/`useQuery` calls into the data-loading layer.
- **Data:** first-class — fetched in `+data` at build, baked in,
  optionally re-fetched client-side. Cleaner than a snapshot.
- **Hosting:** still static on Netlify (pre-rendered output). Can later
  opt individual pages into SSR if ever needed, without leaving Vite.
- **Cost/risk:** a real migration of routing and data-fetching, but it
  keeps the Vite toolchain (ADR-0005) and gives proper per-route head
  control and SSG without a meta-framework rewrite. The strongest
  option if we want a durable SSG foundation rather than a snapshot
  hack.

### Option C — Migrate to a meta-framework (React Router 7 framework mode, Next.js, or Astro)

React Router 7's framework mode supports static `prerender()`;
Next.js and Astro both do SSG/ISR with React.

- **App changes:** largest. Full rewrite of routing and data-fetching;
  Next/Astro also change the build and (for SSR/ISR) the hosting model
  toward Netlify's framework adapters/functions. Astro with React
  islands would additionally rethink which components are interactive.
- **Upside:** most capable and future-proof; ISR gives freshness
  without full rebuilds.
- **Cost/risk:** disproportionate for a six-route artist site. Throws
  away the deliberate, recent Vite investment (ADR-0002, -0005) and the
  Wouter/styled-components choices for capabilities this site does not
  need. Not recommended now.

### Option D — Do nothing further (rely on ADR-0007 + JS-rendering crawlers)

Googlebot renders JS and already indexes the content; ADR-0007 covers
identity for non-JS answer engines. Accept that non-JS crawlers never
see per-route content.

- **Cost/risk:** zero effort. But it leaves the stated content gap
  open — the reason this ADR exists — so it is the baseline to beat,
  not the recommendation.

### Recommendation

Start with **Option A** (headless-browser snapshot) as the pragmatic,
low-risk way to close the content gap without disturbing the app, and
treat **Option B (Vike)** as the upgrade path if/when we want a
first-class SSG foundation with proper per-route data loading and head
control. Options C and D are documented as the bounds (too much / too
little) and are not proposed.

Either A or B must be paired with a **content-freshness trigger**:
add a DatoCMS webhook → Netlify build hook so publishing in DatoCMS
rebuilds the static output. Without it, prerendered content goes stale
the moment an editor changes something — a regression from today's
always-live fetching. This is the single most important non-rendering
consequence of moving to SSG and must ship with it.

## Consequences

- **If adopted (A or B):** non-JS crawlers and answer engines would see
  full per-route content (releases, shows, discography, bio), not just
  the ADR-0007 identity summary. Per-route `<title>`/`<meta>`/canonical
  become possible, improving search snippets and unfurls per page.
  Initial paint also improves (content in the HTML, less waiting on the
  client round-trip).
- **Freshness changes model.** Today content is always live (fetched in
  the browser). After SSG it is as fresh as the last build, so a DatoCMS
  → Netlify build hook becomes mandatory, and `docs/deployment.md`'s
  "no content pre-rendering or build-time snapshot" statement and the
  "DatoCMS is not webhooked into Netlify" note must be updated. There is
  a window between a content edit and the rebuild finishing where the
  site is stale; for this site (shows/releases every few weeks) that is
  acceptable.
- **Build gets heavier and can fail on data.** Prerendering moves
  DatoCMS into the build's critical path: Option A needs Chromium in
  CI; both A and B make a DatoCMS outage or a query error a *build*
  failure rather than a runtime loading placeholder. A fallback (serve
  last good deploy — Netlify already supports rollback) mitigates this.
- **Styling SSR.** styled-components and Emotion both need their style
  extraction wired for whichever option is chosen, or pages flash
  unstyled / warn on hydration. This is a known, solved problem for
  both libraries but is real work and the most likely source of subtle
  bugs.
- **Hosting.** Both recommended options keep Netlify static publishing;
  only the `netlify.toml` redirect rules change (serve per-route files,
  keep the SPA catch-all for unknown paths). No move to per-request SSR
  / Netlify Functions is proposed.
- **If not adopted (D):** no work, no new failure modes, but the
  content gap stays open — non-JS answer engines continue to see only
  the ADR-0007 identity layer.
- **Relationship to ADR-0007:** that ADR is independent and already
  shipped; this one builds on it. If this ADR is implemented, the
  hand-maintained `sitemap.xml` from ADR-0007 should be generated from
  the prerendered route list, and the per-page meta it could not
  provide becomes available.

## References

- [Vike — Pre-rendering (SSG)](https://vike.dev/pre-rendering)
- [Vike — `+prerender`](https://vike.dev/prerender)
- [Vite — Server-Side Rendering guide](https://vite.dev/guide/ssr)
- [Vite discussion #18130 — prerendering React components at build time for SSG](https://github.com/vitejs/vite/discussions/18130)
