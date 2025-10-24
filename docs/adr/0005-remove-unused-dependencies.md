# 5. Remove Unused Dependencies

Date: 2025-10-24

## Status

Accepted

## Context

After implementing code splitting and replacing FontAwesome with inline SVG icons, we identified several unused dependencies in package.json. Unused dependencies increase bundle size, installation time, security surface area, and maintenance burden. A dependency audit using depcheck revealed 8 packages that were no longer needed or never used.

The unused dependencies were:
- `@emotion/babel-plugin` and `@emotion/react` - Emotion CSS-in-JS (project standardizing on Styled Components)
- `@fortawesome/fontawesome-free` - Replaced by custom Icon component
- `browserslist-to-esbuild` - Commented out in vite.config.js, never used
- `core-js` - Not imported anywhere
- `global` - Not imported anywhere
- `react-markdown` - Not used in any components
- `vite-plugin-babel-macros` - Not configured in Vite
- `qs` - Not imported anywhere, no querystring parsing needs

## Decision

Remove all 8 unused dependencies from package.json to reduce project bloat and simplify the dependency tree. This decision follows best practices for minimizing the attack surface and maintenance overhead.

Dependencies removed:
```json
"@emotion/babel-plugin": "^11.11.0"
"@emotion/react": "^11.11.1"
"@fortawesome/fontawesome-free": "^6.5.1"
"browserslist-to-esbuild": "^2.1.1"
"core-js": "^3.34.0"
"global": "^4.4.0"
"react-markdown": "^9.0.1"
"vite-plugin-babel-macros": "^1.0.6"
"qs": "^6.11.2"
```

## Consequences

### Positive
- Reduced `node_modules` size by approximately 20 MB
- Faster `yarn install` times (fewer packages to download and extract)
- Smaller security audit surface area (fewer transitive dependencies)
- Cleaner dependency tree easier to maintain
- Reduced bundle size risk from accidentally importing unused packages

### Negative
- If we need any of these packages in the future, we'll need to reinstall them
- Requires verifying the build still works after removal

### Neutral
- Must run `yarn install` to apply changes
- No runtime impact since packages weren't being used
