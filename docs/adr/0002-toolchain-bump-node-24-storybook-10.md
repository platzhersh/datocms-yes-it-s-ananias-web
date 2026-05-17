# 2. Toolchain Bump: Node 24 and Storybook 10

Date: 2026-05-17

## Status

Accepted

## Context

After ADR-0001 the codebase is on a coherent footing — Apollo Client v3,
Vite 5, modern FontAwesome, lazy routes, restored Storybook 7 — but the
runtime and Storybook versions themselves still lag behind what the
ecosystem treats as current:

- **`.nvmrc`** is pinned to `v20.11.0`. Node 22 went LTS in October 2024
  and Node 24 went LTS (codename Krypton) in October 2025; the current
  Krypton release at the time of this ADR is `v24.15.0` (April 2026).
  `@types/node` is pinned to `"18"`, so type-check is running against
  the wrong runtime surface — `import.meta.env`-style globals and any
  `node:*` imports get out-of-date definitions.
- **Storybook** is on `7.6.14` (February 2024). Storybook 8 (mid-2024)
  dropped legacy addon entry points, 9 (mid-2025) restructured
  `addon-essentials`, and 10 (early 2026) is the current major. Storing
  the project on 7 indefinitely means each future maintenance task has
  to also re-learn the SB7 idioms while the upstream documentation
  moves on. The recently-fixed SB7 build (see commit `c859bba`) was
  always intended as a stepping stone, not the destination.

Neither bump is required for the site to function — Netlify will keep
deploying just fine on Node 20 — but bundling them now is cheaper than
two separate forced-upgrade events later, and both have well-supported
upgrade paths (Node's `nvm install` + `nvm use`, Storybook's
`storybook upgrade` codemod runner).

## Decision

Bundle the two bumps into a single short-lived effort, landed as two
separate commits so each can be bisected:

1. **Node 20 → 24.**
   - `.nvmrc` → `v24.15.0` (current LTS patch).
   - `package.json` `engines.node` → `">=22"` (keep one LTS of
     headroom for contributors who haven't bumped yet; the recommended
     version lives in `.nvmrc`).
   - `@types/node` → `"24"`.
   - The `.github/workflows/ci.yml` workflow already reads
     `node-version-file: '.nvmrc'`, so no workflow change is needed.
   - Re-run `yarn install --frozen-lockfile` + `yarn build` +
     `yarn build-storybook` on Node 24 to verify.

2. **Storybook 7 → 10**, executed by running the official
   `storybook upgrade` codemod runner, which handles intermediate
   migrations in one pass:
   - Replace the pinned `@storybook/*@7.6.14` dependencies with the
     versions Storybook 10 prescribes.
   - Apply codemods to `.storybook/main.js`, `.storybook/preview.js`,
     and any story files that need format updates (e.g. legacy
     `Template.bind({})` → CSF 3 object syntax).
   - Resolve any addon repackaging (most likely `addon-essentials`
     splits from SB9 — the few essentials we actually use, like
     controls and actions, may need to be declared individually).
   - Verify with `yarn build-storybook` and a manual `yarn storybook`
     smoke check; the CI workflow's Build Storybook step gates the
     same on every future PR.

## Consequences

Contributors will need to be on Node 22 or newer (24 recommended); the
`.nvmrc` change makes `nvm use` pick the right version automatically
for anyone using nvm. Netlify's build environment will pick up Node 24
because the platform reads `.nvmrc`.

`@types/node` 24 may surface type errors anywhere the codebase relies
on an API whose signature changed between Node 18 and 24 (e.g.
`Buffer` types, deprecated stream callbacks). The project is mostly
browser code, so the blast radius is small.

Storybook 10 has a smaller bundle, a cleaner addon story, and is what
the upstream docs will be written against for the next several years.
The codemods generally land cleanly on small projects like this one,
but they are still source-modifying scripts — the resulting diff
should be reviewed file-by-file before merge, particularly any
auto-rewritten story files.

If a contributor is on an environment that cannot run Node 22+, this
ADR is the place to revisit. The `engines.node` floor is the
contract.
