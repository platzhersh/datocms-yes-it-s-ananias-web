# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Yes it's Ananias" - a band website for the artist Ananias. It's a React-based single-page application built with Vite, fetching content from DatoCMS via GraphQL (Apollo Client), and deployed on Netlify.

## Development Commands

```bash
# Install dependencies (Node >= 18 required)
yarn install

# Start development server (opens at localhost:3000)
yarn start

# Build for production (outputs to /build)
yarn build

# Preview production build
yarn preview

# Lint code with StandardJS
yarn lint

# Run Storybook (component development)
yarn storybook

# Build Storybook
yarn build-storybook
```

## Environment Configuration

Copy `.env-sample` to `.env` and configure:
- `VITE_APP_DATO_API_TOKEN` - DatoCMS API token (required for content fetching)
- `VITE_APP_GTM_ID` - Google Tag Manager ID
- `VITE_APP_MAILCHIMP_URL`, `VITE_APP_MAILCHIMP_U`, `VITE_APP_MAILCHIMP_ID` - Mailchimp integration

## Architecture

### Tech Stack
- **Build Tool**: Vite 5 with React plugin
- **UI Framework**: React 18
- **Routing**: Wouter (lightweight router)
- **Styling**: Styled Components + Emotion (both coexist), SCSS for legacy styles
- **Data Layer**: Apollo Client v2 (older version) with GraphQL
- **CMS**: DatoCMS (headless CMS)
- **Analytics**: Google Tag Manager
- **Deployment**: Netlify with SPA redirect rules

### Key Patterns

**Apollo Client Setup** (`src/client.js`):
- Configured with DatoCMS GraphQL endpoint
- Uses IntrospectionFragmentMatcher with `schema.json` for fragment validation
- Schema must be manually updated when DatoCMS schema changes
- API token injected via environment variable

**Component Architecture** (Atomic Design):
- `atoms/` - Basic building blocks (ActionButton, ErrorMessage, LoadingPlaceholder)
- `molecules/` - Composite components (Header, Footer, EventListItem, ReleaseCard)
- `organisms/` - Complex components (Navigation, MobileMenu, PhotoGallery, QueryLoader, Theme)
- `features/` - Page-level components (Home, About, Releases, Videos, Shows, FullDiscography)

**QueryLoader Pattern** (`src/components/organisms/QueryLoader/QueryLoader.jsx`):
- Reusable wrapper for Apollo queries
- Handles loading, error, and success states
- Used throughout the app: `<QueryLoader query={GRAPHQL_QUERY} successCallback={(data) => <Component data={data} />} />`

**GraphQL Fragments** (`src/queries/fragments/`):
- Reusable field definitions for DatoCMS models
- `ReleaseFragment.js` - Album/release data structure
- `VideoFragment.js` - Video data structure

**Theme System** (`src/components/organisms/Theme.jsx`, `src/styles/theme.js`):
- Styled Components ThemeProvider wraps entire app
- Color palette defined in `src/styles/colorPalette.js`
- Custom fonts loaded in `src/styles/fonts.js` and `fonts.scss`
- Orange is the primary brand color

**Routing** (`src/components/App.tsx`):
- Wouter handles client-side routing
- Routes: `/`, `/about`, `/releases`, `/videos`, `/shows`, `/discography`
- Netlify redirects all requests to `/index.html` for SPA support

### TypeScript Migration

The project is mid-migration from JavaScript to TypeScript:
- TypeScript enabled with `allowJs: true`
- Mix of `.tsx`, `.ts`, `.jsx`, and `.js` files
- When adding new files, prefer TypeScript
- Models defined in `src/models/` (Release.ts, eventItem.ts, video.ts)

### Styling Approach

Multiple styling systems coexist:
1. **Styled Components** - Primary, used in newer components
2. **Emotion** - Configured via Vite plugin with `jsxImportSource: "@emotion/react"`
3. **SCSS** - Legacy styles in `src/styles/` (fonts.scss, index.scss, old-style.scss)

When creating new components, use Styled Components for consistency with the Theme system.

## Common Workflows

**Adding a New Page**:
1. Create component in `src/components/features/`
2. Add route in `src/components/App.tsx`
3. Add navigation link in `src/components/organisms/Navigation.tsx`

**Fetching DatoCMS Data**:
1. Define GraphQL query (use fragments from `src/queries/fragments/`)
2. Use `QueryLoader` component to wrap query execution
3. Pass `successCallback` to render data

**Updating DatoCMS Schema**:
1. Make changes in DatoCMS admin
2. Manually update `src/schema.json` with new introspection result
3. Update relevant fragments in `src/queries/fragments/`

## Project-Specific Notes

- This is a music artist website featuring releases, videos, shows, and about information
- Events are fetched from an external source (likely DatoCMS)
- Spotify and YouTube embeds are used throughout
- Mailchimp integration for newsletter signups
- Photo gallery uses `react-photo-gallery` and `react-images` libraries
- YouTube videos use `react-lite-youtube-embed` for performance
- StandardJS is the linting standard (no semicolons, 2-space indent)
