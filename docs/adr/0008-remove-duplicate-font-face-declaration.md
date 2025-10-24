# 8. Remove Duplicate Font-Face Declaration

Date: 2025-10-24

## Status

Accepted

## Context

After implementing font loading optimizations in ADR-0003 and ADR-0004, a duplicate font declaration was discovered:

1. **index.html (lines 30-44)**: Preloads the font stylesheet from `//db.onlinewebfonts.com/c/7cf481fc308070912ac3a8357db632c0?family=Nineteen+Ten+Vienna`, which contains the `@font-face` declaration for "Nineteen Ten Vienna"

2. **src/styles/fonts.scss (lines 1-15)**: Contains a redundant `@font-face` declaration for the same "Nineteen Ten Vienna" font, pointing to the exact same font files

This duplication caused several issues:
- Browser would parse the same `@font-face` declaration twice
- Increased CSS bundle size unnecessarily (~600 bytes)
- Created confusion about the single source of truth for font loading
- Violated the DRY (Don't Repeat Yourself) principle
- Made maintenance harder (changes had to be made in two places)

The external stylesheet from onlinewebfonts.com already contains the properly formatted `@font-face` declaration with all font formats (eot, woff2, woff, ttf, svg) and is preloaded in the HTML head for optimal performance.

## Decision

**Remove the duplicate `@font-face` declaration from SCSS:**

1. Delete `src/styles/fonts.scss` entirely (contained only the duplicate declaration)
2. Remove `import './styles/fonts.scss'` from `src/index.tsx`
3. Remove `import '../../styles/fonts.scss'` from `src/components/organisms/Navigation.stories.jsx`
4. Establish index.html preload stylesheet as the single source of truth for font loading

The font will continue to be loaded via the external stylesheet referenced in index.html:
```html
<link
  href="//db.onlinewebfonts.com/c/7cf481fc308070912ac3a8357db632c0?family=Nineteen+Ten+Vienna"
  rel="preload"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
```

## Consequences

### Positive
- Eliminated duplicate `@font-face` parsing
- Reduced CSS bundle size by ~600 bytes (3.53 KB vs 4.13 KB)
- Single source of truth for font loading (index.html)
- Cleaner codebase with one less file to maintain
- No risk of font declaration conflicts or inconsistencies
- Faster CSS parsing (fewer rules to process)

### Negative
- If custom `@font-face` modifications are needed in the future, would require editing the external stylesheet or creating a new local declaration
- Slightly less control over font declaration (relies on external CDN)

### Neutral
- Font loading behavior unchanged (already using external stylesheet)
- All font formats (eot, woff2, woff, ttf, svg) still available via external stylesheet
- `font-display: swap` still applied via the external stylesheet
