# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Yes it's Ananias" - a band website for the artist Ananias. React 18 single-page app built with Vite, content from DatoCMS via GraphQL (`@apollo/client` v3), deployed on Netlify.

## Development Commands

Package manager: **pnpm**, pinned via the `packageManager` field in
`package.json` and activated by corepack (built into Node ≥ 16, on by
default in Node 24). No global `pnpm install` needed — first invocation
will provision it.

```bash
# Install dependencies (Node 24.15.0 pinned in .nvmrc; engines >=22)
pnpm install

# Start dev server (opens browser at localhost:3000)
pnpm start

# Production build — runs `tsc` (type-check, no emit) THEN `vite build`.
# A TypeScript error will fail the build even though Vite would otherwise
# transpile JS/TS the same way.
pnpm build              # outputs to /build

# Preview the production build locally
pnpm preview

# Lint (oxlint, Rust-based; check-only)
pnpm lint
pnpm lint:fix           # auto-fix lint issues

# Format (oxfmt, Rust-based; same style as the old StandardJS: no semis,
# single quotes, 2-space indent, no trailing commas, printWidth 100)
pnpm format             # writes
pnpm format:check       # CI-style check

# Storybook (component sandbox; stories live next to components as *.stories.jsx)
pnpm storybook          # port 6006
pnpm build-storybook
```

There is **no test runner configured** — no `pnpm test`, no Jest/Vitest setup. Don't claim "tests pass"; rely on `pnpm build` (type-check) and `pnpm lint`.

`.npmrc` sets `save-exact=true`, so any added dependency is pinned without a `^` prefix — keep it that way. Build-script approvals (e.g. for `esbuild`) live in `pnpm-workspace.yaml` under `allowBuilds`.

## Environment Configuration

Copy `.env-sample` to `.env`:

- `VITE_APP_DATO_API_TOKEN` - DatoCMS API token (required for content fetching)
- `VITE_APP_GTM_ID` - Google Tag Manager ID
- `VITE_APP_MAILCHIMP_URL`, `VITE_APP_MAILCHIMP_U`, `VITE_APP_MAILCHIMP_ID` - Mailchimp integration

Vite only exposes vars prefixed with `VITE_APP_`; they're read via `import.meta.env.VITE_APP_*`.

## Architecture

### Tech Stack

- **Build**: Vite 5 + `@vitejs/plugin-react` (with Emotion's `jsxImportSource`) + `vite-tsconfig-paths`
- **UI**: React 18, routing via Wouter
- **Styling**: Styled Components (primary) + Emotion + SCSS (legacy) — all three coexist
- **Data**: `@apollo/client`@^3.11.0 (v3 API — `useQuery` hook, `gql` re-exported from `@apollo/client`)
- **CMS**: DatoCMS GraphQL API
- **Dates**: Luxon (`DateTime`) for event handling
- **Analytics**: Google Tag Manager via `react-gtm-module`
- **Deployment**: Netlify (`netlify.toml` redirects all paths to `/index.html` for SPA routing; includes the Lighthouse plugin)

### Apollo Setup (`src/client.js`)

- `@apollo/client`@^3.11.0. `ApolloClient`, `InMemoryCache`, and `HttpLink` are all imported from the single `@apollo/client` entry point. The v3 API is used throughout (hooks, not render-prop `<Query>`).
- Points at `https://graphql.datocms.com` with the API token as a Bearer header.
- Cache: `addTypename: false`, `dataIdFromObject: obj => obj.id`. No `IntrospectionFragmentMatcher` / `possibleTypes` configured — the schema currently has no union/interface types whose fragments need resolving.
- `ApolloProvider` (from `@apollo/client`) wraps `<App />` in `src/index.tsx`.

### Component Architecture (Atomic Design)

- `src/components/atoms/` — primitives (ActionButton, ErrorMessage, LoadingPlaceholder, ExternalLink, YouTubeVideo, …)
- `src/components/molecules/` — composites (Header, Footer, EventListItem, ReleaseCard, MailchimpSignupForm, UpcomingEvents, …)
- `src/components/organisms/` — Navigation, MobileMenu, PhotoGallery, QueryLoader, Theme
- `src/components/features/` — page-level (Home, About, Releases, Videos, FullDiscography)

Newer components live in their own folder (`ComponentName/ComponentName.jsx` + `.stories.jsx`); older ones are flat files in the category directory. Both patterns are present — match the surrounding style.

### Routing (`src/components/App.tsx`)

Wouter `<Switch>` with these routes:

- `/` → `features/Home`
- `/about` → `features/About`
- `/releases` → `features/Releases`
- `/videos` → `features/Videos`
- `/shows` → `molecules/UpcomingEvents` _(note: this is the molecule, not the `features/Shows.jsx` file — that file appears to be a legacy/unused variant)_
- `/discography` → `features/FullDiscography`

### Data Fetching Patterns

Use the `QueryLoader` organism (`organisms/QueryLoader/QueryLoader.jsx`), which wraps `useQuery` from `@apollo/client` and renders `LoadingPlaceholder` / `ErrorMessage` / `successCallback(data)`. Direct `useQuery` calls are also fine when a component needs more control than the wrapper provides.

GraphQL queries are written inline with `gql` imported from `@apollo/client` (not the separate `graphql-tag` package). Reusable field selections live in `src/queries/fragments/` (e.g., `ReleaseFragment.js`, `VideoFragment.js`) — these are exported as raw template strings and interpolated into `gql` queries, not as parsed `DocumentNode`s.

### Theme System

- `Theme` organism (`organisms/Theme.jsx`) wraps the app with Styled Components' `ThemeProvider`.
- Theme object in `src/styles/theme.js` composes `colorPalette.js` + `fonts.js`. Orange is the brand primary (`theme.colors.highlightPrimary`).
- Inside styled components, access via `${props => props.theme.colors.X}`.

### Styling Approach

1. **Styled Components** — primary, theme-aware. Use for new components.
2. **Emotion** — configured via `jsxImportSource: "@emotion/react"` in `vite.config.js` and `@emotion/babel-plugin`. Available but rarely used.
3. **SCSS** — legacy globals imported in `src/index.tsx` (`fonts.scss`, `index.scss`).

`babel-plugin-macros` is enabled via `.babelrc` (used by `graphql.macro`, `babel-plugin-styled-components`).

### TypeScript Migration

Mid-migration: `allowJs: true`, `strict: true`, target `es2020`, JSX `react` (classic runtime). Files are a mix of `.tsx`/`.ts`/`.jsx`/`.js`. **Prefer TypeScript for new files.** Domain models live in `src/models/` (`Release.ts`, `eventItem.ts`, `video.ts`). Path aliases declared in `tsconfig.json` are picked up by Vite via `vite-tsconfig-paths`.

Because `pnpm build` runs `tsc` first, broken types anywhere under `src/` block the production build even if Vite would happily strip them.

## Common Workflows

**Add a page**:

1. Create the component in `src/components/features/` (prefer `.tsx`).
2. Add a `<Route>` in `src/components/App.tsx`.
3. Add a nav link in `src/components/organisms/Navigation.tsx`.

**Fetch DatoCMS data**:

1. Write the query inline with `gql` (imported from `@apollo/client`), interpolating fragments from `src/queries/fragments/`.
2. Wrap it in `<QueryLoader query={Q} successCallback={data => …} />`.

**Add a Storybook story**: drop `Component.stories.jsx` next to the component; it'll be picked up by the glob in `.storybook/main.js` (`src/**/*.stories.@(js|jsx|ts|tsx)`).

## Project-Specific Notes

- Music artist site: releases, videos, shows, about, photo gallery.
- Embeds: Spotify (`SpotifyEmbed`), YouTube via `react-lite-youtube-embed` (lazy, for perf).
- Newsletter: Mailchimp via `react-mailchimp-subscribe` (`MailchimpSignupForm`).
- Photo gallery uses `react-photo-gallery` + `yet-another-react-lightbox`@3.32.0.
- Events come from DatoCMS `allEvents`; `UpcomingEvents` filters to today+future and groups by year using Luxon.
- Lint via `oxlint` (Rust); format via `oxfmt` (Rust, pre-1.0). Style mirrors the old StandardJS conventions: no semis, single quotes, 2-space indent, no trailing commas, printWidth 100. Configs at `.oxlintrc.json` and `.oxfmtrc.json`.
