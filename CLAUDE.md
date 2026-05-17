# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Yes it's Ananias" - a band website for the artist Ananias. React 18 single-page app built with Vite, content from DatoCMS via GraphQL (Apollo Client v2), deployed on Netlify.

## Development Commands

```bash
# Install dependencies (Node 20.11.0 pinned in .nvmrc; package.json requires >=18)
yarn install

# Start dev server (opens browser at localhost:3000)
yarn start

# Production build — runs `tsc` (type-check, no emit) THEN `vite build`.
# A TypeScript error will fail the build even though Vite would otherwise
# transpile JS/TS the same way.
yarn build              # outputs to /build

# Preview the production build locally
yarn preview

# Lint/format with StandardJS (no semicolons, 2-space indent, single quotes)
yarn lint               # runs `standard --fix`

# Storybook (component sandbox; stories live next to components as *.stories.jsx)
yarn storybook          # port 6006
yarn build-storybook
```

There is **no test runner configured** — no `yarn test`, no Jest/Vitest setup. `@types/jest` is in devDependencies but unused. Don't claim "tests pass"; rely on `yarn build` (type-check) and `yarn lint`.

`.npmrc` sets `save-exact=true`, so any added dependency is pinned without a `^` prefix — keep it that way.

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
- **Data**: Apollo Client v2.6 (`apollo-client` + `react-apollo` 3.1, NOT `@apollo/client`)
- **CMS**: DatoCMS GraphQL API
- **Dates**: Luxon (`DateTime`) for event handling
- **Analytics**: Google Tag Manager via `react-gtm-module`
- **Deployment**: Netlify (`netlify.toml` redirects all paths to `/index.html` for SPA routing; includes the Lighthouse plugin)

### Apollo Setup (`src/client.js`)
- Points at `https://graphql.datocms.com` with the API token as a Bearer header.
- Uses `IntrospectionFragmentMatcher` against `src/schema.json`. **`schema.json` is checked in and must be manually re-fetched whenever the DatoCMS schema changes** — there is no codegen step.
- Cache: `addTypename: false`, `dataIdFromObject: obj => obj.id`.
- `ApolloProvider` wraps `<App />` in `src/index.tsx`.

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
- `/shows` → `molecules/UpcomingEvents` *(note: this is the molecule, not the `features/Shows.jsx` file — that file appears to be a legacy/unused variant)*
- `/discography` → `features/FullDiscography`

### Data Fetching Patterns
Two patterns coexist — be aware of both:
1. **`QueryLoader` organism** (`organisms/QueryLoader/QueryLoader.jsx`): wraps `<Query>` and renders `LoadingPlaceholder` / `ErrorMessage` / `successCallback(data)`. Preferred for new code.
2. **Direct `<Query>` from `react-apollo`**: still used in older components like `molecules/UpcomingEvents.jsx`. If you touch one of these, you may migrate it to `QueryLoader`, but it's not required.

GraphQL queries are written inline with `graphql-tag`'s `gql` template tag. Reusable field selections live in `src/queries/fragments/` (e.g., `ReleaseFragment.js`, `VideoFragment.js`) — these are exported as raw template strings and interpolated into `gql` queries, not as parsed `DocumentNode`s.

### Theme System
- `Theme` organism (`organisms/Theme.jsx`) wraps the app with Styled Components' `ThemeProvider`.
- Theme object in `src/styles/theme.js` composes `colorPalette.js` + `fonts.js`. Orange is the brand primary (`theme.colors.highlightPrimary`).
- Inside styled components, access via `${props => props.theme.colors.X}`.

### Styling Approach
1. **Styled Components** — primary, theme-aware. Use for new components.
2. **Emotion** — configured via `jsxImportSource: "@emotion/react"` in `vite.config.js` and `@emotion/babel-plugin`. Available but rarely used.
3. **SCSS** — legacy globals imported in `src/index.tsx` (`fonts.scss`, `index.scss`, `old-style.scss`).

`babel-plugin-macros` is enabled via `.babelrc` (used by `graphql.macro`, `babel-plugin-styled-components`).

### TypeScript Migration
Mid-migration: `allowJs: true`, `strict: true`, target `es5`, JSX `react` (classic runtime). Files are a mix of `.tsx`/`.ts`/`.jsx`/`.js`. **Prefer TypeScript for new files.** Domain models live in `src/models/` (`Release.ts`, `eventItem.ts`, `video.ts`). Path aliases declared in `tsconfig.json` are picked up by Vite via `vite-tsconfig-paths`.

Because `yarn build` runs `tsc` first, broken types anywhere under `src/` block the production build even if Vite would happily strip them.

## Common Workflows

**Add a page**:
1. Create the component in `src/components/features/` (prefer `.tsx`).
2. Add a `<Route>` in `src/components/App.tsx`.
3. Add a nav link in `src/components/organisms/Navigation.tsx`.

**Fetch DatoCMS data**:
1. Write the query inline with `gql`, interpolating fragments from `src/queries/fragments/`.
2. Wrap it in `<QueryLoader query={Q} successCallback={data => …} />`.
3. If the schema changed, refresh `src/schema.json` (introspection result) — otherwise fragment matching will warn/break.

**Add a Storybook story**: drop `Component.stories.jsx` next to the component; it'll be picked up by the glob in `.storybook/main.js` (`src/**/*.stories.@(js|jsx|ts|tsx)`).

## Project-Specific Notes

- Music artist site: releases, videos, shows, about, photo gallery.
- Embeds: Spotify (`SpotifyEmbed`), YouTube via `react-lite-youtube-embed` (lazy, for perf).
- Newsletter: Mailchimp via `react-mailchimp-subscribe` (`MailchimpSignupForm`).
- Photo gallery uses `react-photo-gallery` + `react-images`.
- Events come from DatoCMS `allEvents`; `UpcomingEvents` filters to today+future and groups by year using Luxon.
- StandardJS is the lint standard (no semicolons, 2-space indent, single quotes) — `yarn lint` auto-fixes.
