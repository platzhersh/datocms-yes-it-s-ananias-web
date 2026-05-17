# 1. Codebase Cleanup and Performance Improvements

Date: 2026-05-17

## Status

Proposed

## Context

A walkthrough of the codebase in May 2026 surfaced a backlog of latent bugs,
dead code, duplicated styling systems, and bundle-size waste that has
accumulated since the v2.0 launch in 2021. Symptoms include:

- Google Tag Manager initialization (`src/gtm.js`) is syntactically broken
  and throws on every page load — analytics has been silently dead in
  production.
- The `/shows` route still has a stale duplicate (`features/Shows.jsx`)
  that no router entry references.
- Two parallel data-fetching patterns coexist for Apollo queries: a
  reusable `QueryLoader` organism and hand-rolled render-prop `<Query>`
  blocks scattered across feature components.
- Three styling systems (Styled Components, Emotion, SCSS) coexist, with
  brand colours duplicated between `colorPalette.js`, `index.scss`, and
  `old-style.scss` (the latter is ~60 lines, mostly commented out).
- The full FontAwesome CSS (~70 KB) is shipped to use ~11 icons.
- All feature pages are eagerly imported in `App.tsx`; there is no
  route-level code splitting.
- TypeScript's `target` is pinned to `es5` despite a browserslist that
  excludes IE and dead browsers, bloating the build with unnecessary
  polyfills.
- Lodash is imported by default (`import _ from "lodash"`) for a single
  `groupBy` call, defeating tree-shaking.
- `apollo-client@2.6.10` and `react-apollo@3.1` are end-of-life; the
  hand-maintained `src/schema.json` introspection blob exists for a
  `IntrospectionFragmentMatcher` that currently has no union or
  interface types to match against.
- Several `.map()` renders are missing `key` props, and the viewport
  meta in `index.html` disables pinch-zoom (an accessibility regression).
- A handful of unused dependencies (`react-markdown`, `qs`, `core-js`,
  `global`, `browserslist-to-esbuild`, `@types/jest`) inflate
  `node_modules` and `yarn.lock`.

Left unaddressed, these will continue to compound: bundle size will keep
growing, the EOL Apollo stack will block React 19 / Suspense adoption,
and the duplicated style systems make every visual change a
guess-and-check exercise.

## Decision

We will treat the cleanup as a sequenced initiative rather than a single
refactor, sized so each step can ship independently. The backlog, in the
order it will be executed:

1. **Hotfixes (small, high-impact)**
   - Rewrite `src/gtm.js` so GTM actually initializes.
   - Add missing React `key` props in `Releases`, `UpcomingEvents`, and
     `FeaturedContent`.
   - Fix the `index.html` viewport meta to permit zoom.
   - Replace the always-rendered "Mailchimp Settings missing" string with
     a silent `null` return plus a dev-only warning.

2. **Dead code and dependency pruning**
   - Delete `src/components/features/Shows.jsx`, `src/styles/old-style.scss`,
     and the unused dependencies listed above.
   - Remove the no-op `build.uglify` option in `vite.config.js`.
   - Remove the empty `styled.X` wrappers that exist only as semantic
     tags.

3. **Performance: bundle and load time**
   - Switch FontAwesome to `@fortawesome/react-fontawesome` with
     per-icon imports.
   - Add `React.lazy` + `Suspense` for each route in `App.tsx`.
   - Move the custom font from an SCSS `@import` to a `<link
     rel="preload">` + `<link rel="stylesheet">` in `index.html`.
   - Raise `tsconfig` `target` to `es2020`.
   - Replace the default lodash import with `lodash/groupBy` (or native).

4. **Styling consolidation**
   - Treat the Styled Components theme as the single source of truth for
     colours and fonts; strip `index.scss` to body/reset only or delete it.
   - Remove the duplicated SCSS brand-colour variables.

5. **Apollo Client v2 → v3 migration** (largest, scheduled last)
   - Replace `apollo-client` + `react-apollo` with `@apollo/client` v3.
   - Replace render-prop `<Query>` usages and `QueryLoader` callsites
     with the `useQuery` hook.
   - Delete `src/schema.json` and the `IntrospectionFragmentMatcher`
     setup; reintroduce `possibleTypes` only if a union/interface type
     is actually queried.

6. **Library replacement**
   - Replace the unmaintained `react-images` lightbox in `PhotoGallery`
     with `yet-another-react-lightbox`.

Each step lands as its own commit (or small PR) so regressions can be
bisected. Steps 1–4 are independent and can be parallelized; steps 5
and 6 are sequenced last because they touch the most surface area.

## Consequences

The site's initial JavaScript payload shrinks meaningfully (steps 3
and 5 are the bulk of it), analytics starts reporting again, and the
codebase converges on a single source of truth for both data fetching
(Apollo hooks) and styling (Styled Components theme). Newer Claude
Code / contributor sessions have fewer "which pattern do I follow?"
decisions to make.

The Apollo v3 migration is a meaningful surface-area change: every
`Query` callsite gets touched, and any code that depends on the v2
cache shape (`addTypename: false`, `dataIdFromObject`) will need to be
re-validated against v3's normalized cache. It will require a
deliberate QA pass against the live DatoCMS schema.

Switching FontAwesome to per-icon imports and lazy-loading routes both
move some failure modes from build-time to runtime: an icon that isn't
imported renders as a blank square, and a Suspense boundary that
throws will show the loading placeholder indefinitely. These are
small, surface-able issues but worth noting.

Deleting `src/styles/old-style.scss` and the legacy class-based
selectors in `index.scss` will remove styles that may still be
referenced by `className` strings in older components (`Header-h1`,
`Footer-footer`, etc.); each removal needs a visual diff.

Once complete, this ADR is superseded only when a further architectural
shift is proposed; individual steps do not require their own ADRs
unless they deviate from the plan above.
