# 6. Standardize on Styled Components and Remove Emotion

Date: 2025-10-24

## Status

Accepted

## Context

The project had two CSS-in-JS libraries coexisting:
1. **Styled Components** - Used extensively throughout the codebase for component styling with the Theme system
2. **Emotion** - Configured in Vite but barely used, with `@emotion/react` and `@emotion/babel-plugin` in dependencies

Having two CSS-in-JS libraries creates several problems:
- Increased bundle size from shipping two runtime libraries with overlapping functionality
- Developer confusion about which library to use for new components
- Maintenance burden of keeping both libraries up to date
- Potential styling conflicts or inconsistencies
- Build configuration complexity (separate Babel plugins for each)

Analysis showed that Styled Components is the primary styling solution:
- Theme system (`src/styles/theme.js`, `src/components/organisms/Theme.jsx`) built on Styled Components
- Most components use Styled Components
- No components found using Emotion's `css` prop or `@emotion/react` imports

## Decision

**Standardize on Styled Components as the single CSS-in-JS solution:**

1. Remove Emotion dependencies:
   - `@emotion/react`
   - `@emotion/babel-plugin`

2. Update Vite configuration:
   - Remove Emotion-specific plugin configuration
   - Keep only `babel-plugin-styled-components`
   - Remove `jsxImportSource: "@emotion/react"`

3. Update build configuration:
   - Remove `@emotion/react` from `vendor-ui` manual chunk
   - Keep only `styled-components` in vendor-ui

4. Future component development:
   - All new components must use Styled Components
   - Follow existing Theme system patterns
   - No Emotion usage allowed

## Consequences

### Positive
- Reduced bundle size by ~15-20 KB (vendor-ui chunk smaller)
- Eliminated runtime overhead of unused Emotion library
- Clearer developer guidelines - single styling approach
- Simpler build configuration with one Babel plugin
- Consistent styling patterns across entire codebase
- Easier onboarding for new developers (one library to learn)

### Negative
- If Emotion-specific features are needed in the future, would require re-adding the library
- Small migration effort if any hidden Emotion usage exists (none found during audit)

### Neutral
- No existing code changes required (Emotion wasn't being used)
- Styled Components is well-maintained and widely adopted
- Both libraries have similar performance characteristics
