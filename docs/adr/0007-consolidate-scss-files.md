# 7. Consolidate SCSS Files

Date: 2025-10-24

## Status

Accepted

## Context

The project had multiple SCSS files with overlapping purposes:
- `src/styles/index.scss` - Main stylesheet with global styles and resets
- `src/styles/old-style.scss` - Legacy styles with utility classes and overrides
- `src/styles/fonts.scss` - Custom font loading (Facets NF)

Having `old-style.scss` as a separate file created maintenance issues:
- Multiple import statements in `src/index.tsx` make it unclear which styles are applied
- Difficult to trace where specific styles are defined (split across multiple files)
- "old-style" naming suggests technical debt but contains actively used styles
- Potential for style conflicts or duplication across files
- Extra HTTP request in development mode for separate stylesheet

Analysis of `old-style.scss` showed it contained:
- Utility classes (`.color-creme`, `.color-tangerine`, `.uppercase`, `.facets`)
- Component styles (`.social-icons`, `.site-title`)
- Global link styles (`a, a:link, a:active...`)
- Section backgrounds (`.section-videos`)
- No conflicts with styles in `index.scss`

## Decision

**Consolidate `old-style.scss` into `index.scss`:**

1. Merge all styles from `old-style.scss` into `index.scss`
2. Remove `old-style.scss` file from the codebase
3. Remove the import statement from `src/index.tsx`
4. Keep `fonts.scss` separate (distinct purpose - font-face declarations)

The consolidated `index.scss` will contain:
- CSS resets and base styles
- Utility classes for colors and typography
- Global component styles
- Section-specific styles

Future style organization:
- Global/utility styles → `index.scss`
- Font declarations → `fonts.scss`
- Component-specific styles → Styled Components (preferred)
- Only use SCSS for truly global styles that can't be componentized

## Consequences

### Positive
- Single source of truth for global SCSS styles
- Easier to find and maintain global styles (one file to check)
- One fewer import statement in entry point
- Removed technical debt naming ("old-style")
- Slightly faster development build (one fewer file to process)
- Clearer separation: fonts.scss for fonts, index.scss for global styles, Styled Components for component styles

### Negative
- `index.scss` is now longer (~150 lines vs ~100)
- If styles need to be split in the future, requires undoing this consolidation

### Neutral
- No runtime performance impact (styles would be bundled together anyway)
- Git history for old-style.scss preserved
- Styles remain functionally identical after merge
