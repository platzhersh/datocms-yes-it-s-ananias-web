# 1. Implement Route-Based Code Splitting

Date: 2025-10-24

## Status

Accepted

## Context

The application was loading all routes and their dependencies in a single JavaScript bundle of 728 KB (231 KB gzipped). This resulted in:

- Slow initial page load times, especially on mobile and slower connections
- Users downloading code for routes they might never visit
- Poor Time to Interactive (TTI) metrics
- Vite build warnings about chunks larger than 500 KB

Modern browsers support dynamic imports, and React provides `lazy()` and `Suspense` APIs specifically for this use case. The application uses Wouter for routing, which works seamlessly with code splitting.

## Decision

We implemented route-based code splitting using React's `lazy()` and `Suspense` APIs in `src/components/App.tsx`:

1. **Convert route imports to lazy loading**:
   ```typescript
   const Home = lazy(() => import("./features/Home"));
   const About = lazy(() => import("./features/About"));
   const Releases = lazy(() => import("./features/Releases"));
   // ... etc
   ```

2. **Wrap routes with Suspense boundary**:
   ```typescript
   <Suspense fallback={<LoadingPlaceholder />}>
     <Switch>
       {/* routes */}
     </Switch>
   </Suspense>
   ```

3. **Configure Vite for manual chunk splitting** in `vite.config.js`:
   - `vendor-react`: React, React-DOM, Wouter (routing)
   - `vendor-apollo`: Apollo Client and GraphQL ecosystem
   - `vendor-ui`: Styled Components and Emotion
   - `vendor-utils`: Lodash, Luxon, QS

## Consequences

### Positive

- **Dramatic bundle size reduction**: Initial bundle reduced from 231 KB to ~32 KB gzipped (86% reduction)
- **Faster initial page load**: Only loads code needed for the current route
- **Better caching**: Vendor libraries cached separately from app code
- **Parallel downloads**: Browser can fetch multiple smaller chunks simultaneously
- **Improved performance metrics**: Better Lighthouse scores, faster TTI
- **Scalability**: Adding new routes has minimal impact on initial load time

### Negative

- **Slight delay on route navigation**: ~100-300ms delay when navigating to a new route for the first time (chunk download)
- **More complexity**: Additional Suspense boundaries and loading states to manage
- **More network requests**: Multiple smaller files instead of one large file (though this is generally better)

### Neutral

- **Development hot reload**: Slightly slower in some cases due to additional boundaries
- **Build output**: More files generated in build directory
- **Browser compatibility**: Works in all modern browsers (IE11 would need polyfills)

## Implementation Details

The split resulted in the following bundle structure:
- Main app code: 31.7 KB (11.8 KB gzipped)
- Vendor React: 146.3 KB (47.4 KB gzipped)
- Vendor Apollo: 150.2 KB (41.8 KB gzipped)
- Vendor UI: 40.7 KB (14.2 KB gzipped)
- Vendor Utils: 140.5 KB (48.0 KB gzipped)
- Route chunks: 0.5-195 KB each (loaded on-demand)

Initial page load now requires: ~164 KB gzipped vs. 231 KB before (29% reduction, excluding FontAwesome removal).
