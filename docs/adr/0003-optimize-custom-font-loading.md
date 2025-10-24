# 3. Optimize Custom Font Loading Strategy

Date: 2025-10-24

## Status

Accepted

## Context

The application loads a custom font "Nineteen Ten Vienna" from an external CDN (`db.onlinewebfonts.com`). The initial implementation had several performance issues:

1. **Blocking font loading**: `font-display: auto` in `src/styles/fonts.scss` caused Flash of Invisible Text (FOIT), blocking text rendering for up to 3 seconds while fonts loaded
2. **Incorrect preload configuration**: The `<link>` tag in `index.html` used `type="text/css"` instead of the correct `as="style"` attribute
3. **Render-blocking CSS**: The font CSS wasn't properly preloaded, causing additional render delays

These issues resulted in:
- Blank screens during initial page load
- Poor Cumulative Layout Shift (CLS) scores
- Frustrated users on slower connections seeing nothing for 2-3 seconds

Modern browsers support `font-display` descriptors that give developers control over font loading behavior, and proper resource hints can improve perceived performance.

## Decision

We optimized the font loading strategy with two changes:

### 1. Changed `font-display` from `auto` to `swap` in `src/styles/fonts.scss`

```scss
@font-face {
  font-family: 'Nineteen Ten Vienna';
  font-display: swap;  /* Changed from: auto */
  /* ... */
}
```

### 2. Fixed preload and made CSS non-blocking in `index.html`

```html
<link
  href="//db.onlinewebfonts.com/c/..."
  rel="preload"
  as="style"  <!-- Fixed: was type="text/css" -->
  onload="this.onload=null;this.rel='stylesheet'"
/>
<noscript>
  <link href="//db.onlinewebfonts.com/c/..." rel="stylesheet" />
</noscript>
```

## Consequences

### Positive

- **Eliminates FOIT**: Text renders immediately in fallback font (sans-serif)
- **Faster perceived load time**: Users see content immediately, even if fonts are still loading
- **Better user experience**: Content is readable during font download
- **Improved Core Web Vitals**: Better FCP (First Contentful Paint) and LCP (Largest Contentful Paint)
- **Progressive enhancement**: Content loads first, then custom fonts enhance the design
- **No JavaScript required**: Works even if JS is disabled (noscript fallback)

### Negative

- **Flash of Unstyled Text (FOUT)**: Users briefly see fallback font before custom font loads (~100-500ms)
- **Layout shift potential**: If fallback font metrics differ significantly from custom font (minor CLS impact)
- **Brand consistency delay**: Custom brand font appears after initial render

### Neutral

- **Total load time unchanged**: Fonts still need to download, just doesn't block rendering
- **Caching behavior**: Once cached, subsequent visits load custom font immediately
- **External dependency**: Still depends on `db.onlinewebfonts.com` CDN availability

## Technical Details

### `font-display: swap` Behavior

1. **Block period (0-100ms)**: Browser waits for font, text invisible
2. **Swap period (100ms-3s)**: Text renders with fallback, swaps to custom font when loaded
3. **Failure period (3s+)**: If font still not loaded, remains in fallback (font downloads continue)

This provides a good balance between avoiding FOIT and preserving brand identity.

### Preload Optimization

The `as="style"` attribute tells the browser:
- Download this as a high-priority resource
- Don't block rendering waiting for it
- Load it asynchronously via `onload` handler

## Alternatives Considered

1. **`font-display: optional`**: Would skip font loading entirely on slow connections. Too aggressive for brand font.
2. **Self-hosting fonts**: Would eliminate external dependency but requires hosting infrastructure and bandwidth. Deferred for future consideration.
3. **Font subsetting**: Reduce font file size by including only used characters. Complex to maintain.
4. **Variable fonts**: Modern format with better compression. Not available for this specific font.

The `font-display: swap` + proper preload approach provides immediate benefits without infrastructure changes.

## Performance Impact

- **Before**: 500ms-2s blank text (FOIT), ~2s render delay
- **After**: Immediate text visibility, smooth font swap within 100-500ms
- **Perceived improvement**: ~1-1.5s faster initial render

## Future Considerations

- Consider self-hosting fonts for better reliability and control
- Implement font loading events for custom swap animations
- Add font preconnect for DNS/TCP/TLS pre-warming (already present)
