# 2. Replace FontAwesome with Inline SVG Icons

Date: 2025-10-24

## Status

Accepted

## Context

The application was loading the entire FontAwesome library (`@fortawesome/fontawesome-free`) via a CSS import in `src/index.tsx`. This included:

- **Font files totaling ~1.5 MB**:
  - fa-solid-900: 919 KB SVG, 203 KB TTF, 203 KB EOT, 101 KB WOFF, 78 KB WOFF2
  - fa-brands-400: 748 KB SVG, 134 KB TTF, 134 KB EOT, 90 KB WOFF, 77 KB WOFF2
  - fa-regular-400: 145 KB SVG, 34 KB TTF, 34 KB EOT, 16 KB WOFF, 13 KB WOFF2
- **Multiple format duplicates** for browser compatibility
- **Thousands of icons** when the application only used 4

Analysis showed the application only used these icons:
1. `fa-shopping-basket` (purchase links)
2. `fa-spotify` (Spotify links)
3. `fa-envelope` (contact email)
4. `fa-youtube` (YouTube links)

Loading 1.5 MB of assets for 4 icons represents massive waste and significantly impacts initial page load performance.

## Decision

We replaced FontAwesome with a custom Icon component using inline SVG:

1. **Created `src/components/atoms/Icon/Icon.tsx`**:
   - TypeScript component with type-safe icon names
   - Inline SVG definitions for only the 4 needed icons
   - Configurable size and className props
   - Uses `currentColor` for theme integration

2. **Updated all icon usage**:
   - `ActionButtonMediaLink.jsx`: Changed from `iconClassName` prop to `iconName` prop
   - `Contact.jsx`: Replaced `<i className='fas fa-envelope' />` with `<Icon name='envelope' />`
   - All link components updated: PurchaseLink, SpotifyLink, YoutubeLink

3. **Removed FontAwesome dependency import**:
   - Deleted `import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'` from `src/index.tsx`
   - Package can be removed in a future cleanup (kept for now to avoid breaking other potential uses)

## Consequences

### Positive

- **1.5 MB removed from bundle**: No font files downloaded
- **Faster initial load**: Eliminates ~1-3 seconds of load time on 4G connections
- **Better caching**: Icons bundled with JS, cached as part of app code
- **Tree-shaking**: Only icons actually used are included
- **Type safety**: TypeScript ensures only valid icon names are used
- **Theme integration**: Icons use `currentColor` and work with styled-components theme
- **Zero external dependencies**: No external font CDN, no network request failures
- **Scalability**: Easy to add new icons without bloating the bundle

### Negative

- **Manual maintenance**: New icons must be manually added to Icon component
- **Limited icon library**: Only 4 icons available (vs. 1000+ in FontAwesome)
- **SVG size**: If many icons are needed, inline SVG could grow (not a concern with 4 icons)
- **Migration effort**: All icon usage must be updated (one-time cost, completed)

### Neutral

- **Visual consistency**: SVG icons render identically to FontAwesome
- **Accessibility**: Same ARIA patterns can be applied
- **Browser support**: SVG is universally supported in modern browsers

## Implementation Details

The Icon component:
- Accepts props: `name`, `className`, `size` (default: 16)
- Icon names: `'shopping-basket' | 'spotify' | 'envelope' | 'youtube'`
- SVG paths sourced from FontAwesome's official SVG definitions
- Total size of all 4 icons: ~2 KB (vs. 1.5 MB before)

## Alternatives Considered

1. **react-icons**: Tree-shakeable but adds ~50 KB for the library overhead
2. **FontAwesome React components**: Slightly better than CSS but still large (~200 KB)
3. **Icon sprites**: Would require additional HTTP request and sprite management
4. **Keep FontAwesome**: Rejected due to massive size for minimal usage

The inline SVG approach provides the best size/performance trade-off for this use case.
