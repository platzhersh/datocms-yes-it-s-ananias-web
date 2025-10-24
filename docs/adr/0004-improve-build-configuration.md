# 4. Improve Build Configuration and Remove Redundancies

Date: 2025-10-24

## Status

Accepted

## Context

After implementing the initial performance optimizations (code splitting, FontAwesome removal, font loading), we identified several additional inefficiencies and configuration issues:

1. **Invalid Vite configuration**: `uglify: true` in `vite.config.js` was a no-op. Vite doesn't support the `uglify` option - it uses esbuild for minification by default.

2. **Redundant font loading**: `fonts.scss` contained an `@import` statement that downloaded the font stylesheet, followed by an `@font-face` declaration with the same font URLs. This caused the browser to fetch the font CSS twice - once via `@import` and once when parsing the `@font-face`.

3. **Incorrect script attribute**: `index.html` had `<script type="module" async>` - the `async` attribute is redundant for ES modules, which are deferred by default.

4. **Missing explicit build settings**: The build configuration lacked explicit settings for minification, source maps, and CSS code splitting.

These issues didn't cause failures but represented missed optimization opportunities and unnecessary network requests.

## Decision

We implemented the following build configuration improvements:

### 1. Fixed Vite Build Configuration (`vite.config.js`)

Replaced the invalid `uglify: true` with proper Vite build options:

```javascript
build: {
  outDir: "build",
  minify: 'esbuild',  // Explicit (was default, but now clear)
  sourcemap: false,    // Disable for production (reduce file size)
  cssCodeSplit: true,  // Split CSS per chunk (better caching)
  rollupOptions: {
    // ... existing manualChunks
  }
}
```

### 2. Removed Redundant Font Import (`src/styles/fonts.scss`)

**Before:**
```scss
@import url('//db.onlinewebfonts.com/c/...'); // Downloads stylesheet
@font-face {
  // Same font URLs duplicated here
}
```

**After:**
```scss
@font-face {
  // Direct font URLs only
}
```

The font CSS is already preloaded in `index.html`, making the `@import` completely redundant. The `@font-face` declaration provides all necessary font URLs.

### 3. Removed Redundant `async` Attribute (`index.html`)

Changed `<script type="module" src="/src/index.tsx" async>` to `<script type="module" src="/src/index.tsx">`.

ES modules are automatically deferred and execute after document parsing, making `async` redundant and potentially confusing.

## Consequences

### Positive

- **Eliminated double font loading**: One less HTTP request to the font CDN (~1 KB saved)
- **Cleaner build configuration**: Explicit settings make intent clear
- **No source maps in production**: Slightly smaller build output
- **CSS code splitting enabled**: Better caching granularity for styles
- **Standards compliance**: Removed incorrect/redundant HTML attributes
- **Faster builds**: esbuild minification is fast and explicit

### Negative

- **No source maps in production**: Debugging production issues requires local reproduction (acceptable trade-off)
- **CSS split into multiple files**: Slightly more HTTP requests (but better caching offsets this)

### Neutral

- **No functional changes**: These are optimization and cleanup improvements
- **Build output size**: Minimal change (~100 bytes saved from font redundancy)

## Technical Details

### Font Loading Flow (After Optimization)

1. **index.html**: Preloads font CSS with `rel="preload" as="style"`
2. **fonts.scss**: Only contains `@font-face` declaration
3. **Browser**: Fetches fonts when needed, no duplicate requests

### Build Settings Rationale

- **`minify: 'esbuild'`**: Fast, effective minification (default, now explicit)
- **`sourcemap: false`**: Production builds don't need maps (development uses dev server)
- **`cssCodeSplit: true`**: Each lazy-loaded chunk gets its own CSS file

### CSS Size Impact

Before: 4.23 KB (1.57 KB gzipped)
After: 4.13 KB (1.54 KB gzipped)
Savings: ~100 bytes (~30 bytes gzipped)

## References

- [Vite Build Options](https://vitejs.dev/config/build-options.html)
- [ES Module Script Loading](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type)
- [CSS @import Performance](https://developer.mozilla.org/en-US/docs/Web/CSS/@import#performance_considerations)
