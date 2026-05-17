# 3. Switch Lint and Format Tooling to the Ox Stack

Date: 2026-05-17

## Status

Accepted

## Context

The project currently uses `standard` (StandardJS) for both linting and
auto-formatting, invoked through two scripts:

- `yarn lint` → `standard --fix` (developer-facing; mutates files)
- `yarn lint:ci` → `standard` (CI; check-only, currently non-blocking)

StandardJS is a thin wrapper around ESLint with a frozen rule set. It
works, but the linter is showing its age in this codebase:

- It runs against every file from a Node process; on every save in
  editors and on every CI run we pay the JS-startup tax.
- The rule set is opinionated and not configurable, so any change in
  taste (e.g. wanting to use trailing commas, or surface a custom
  React rule) requires forking off StandardJS entirely.
- ESLint itself is mid-migration to the flat-config / v9 world; staying
  on StandardJS keeps us on the old config style indefinitely.
- There is no separate formatter — StandardJS' `--fix` is the only way
  to reformat, which couples linting decisions and formatting
  decisions into a single tool.

The Ox project (`oxc.rs`) is a Rust-based JavaScript/TypeScript
toolchain whose lint (`oxlint`) and format (`oxfmt`) packages are now
mature enough to consider:

- `oxlint@1.65.0` (stable, daily-released for the past year). Drop-in
  ESLint-rule coverage for the rules a project of this size cares
  about, including React and TypeScript plugins, with documented
  startup-time improvements measured in 50–100x over ESLint on
  small-to-medium projects.
- `oxfmt@0.50.0` (pre-1.0 but actively shipped — last release two days
  before this ADR). A Prettier-compatible formatter with the same
  Rust-binary speed profile.

Vite continues to handle the actual build transform via esbuild;
the Ox swap is strictly for the lint + format layer.

## Decision

Replace the `standard` dependency with `oxlint` and `oxfmt`. Concretely:

1. **Remove** `standard@17.1.0` from devDependencies.
2. **Add** `oxlint` and `oxfmt` as devDependencies, pinned exact per
   `.npmrc` (`save-exact=true`).
3. **Add config files** at repo root:
   - `.oxlintrc.json` — enable the React + TypeScript plugins, set
     the rule set roughly equivalent to what StandardJS enforces
     today (no semis, single quotes, two-space indent, etc.).
   - Any `oxfmt` config the version supports; otherwise rely on its
     defaults (the formatter is intentionally opinionated).
4. **Update scripts** in `package.json`:
   - `lint` → `oxlint` (check-only by default; developers can opt
     into autofix via `oxlint --fix`)
   - `lint:fix` → `oxlint --fix && oxfmt`
   - `lint:ci` → `oxlint` (block on real errors; the previous
     `continue-on-error: true` in the CI workflow can be tightened
     once we confirm the rule set is clean)
   - `format` → `oxfmt`
   - `format:check` → `oxfmt --check`
5. **Update the CI workflow** so the lint step runs `oxlint` and a
   new `Format check` step runs `oxfmt --check`. Both can stay
   non-blocking through the first PR to gauge whether the migrated
   rule set produces any unexpected hits.
6. **Apply `oxfmt` to the existing codebase** in a single sweep
   commit so the lint commit afterwards has a stable formatting
   baseline.

Acceptance criteria: `pnpm lint` passes from a clean tree; `pnpm build`
and `pnpm build-storybook` continue to pass unchanged; `oxfmt --check`
returns clean.

## Consequences

Lint runs locally and in CI drop from several-second JS startup to
sub-second Rust startup; in the long run that is the headline win.

Treating formatting (`oxfmt`) as a separate tool from linting
(`oxlint`) is also a structural improvement — formatter changes can
land independently from lint-rule changes, and IDE format-on-save
becomes a clear concept rather than "let standard --fix figure it
out."

`oxfmt` is pre-1.0; its output format is not guaranteed stable across
minor versions. The exact-pin via `.npmrc` keeps any churn deterministic
within the repo, but bumping `oxfmt` will need to be a deliberate
commit that reformats the codebase. Pinning oxfmt to a single version
is also a recommendation upstream gives explicitly.

Rule parity with StandardJS will not be 100%. Some of the more obscure
StandardJS rules either have no direct `oxlint` equivalent or are
covered under different rule names; the `.oxlintrc.json` is the place
to track those choices. If something StandardJS used to catch starts
slipping through, the answer is to look up the corresponding
ESLint-rule name and enable it in `.oxlintrc.json` — `oxlint`
implements the ESLint rule namespace directly.

If `oxlint` or `oxfmt` later gain a fatal regression, we can revert
this ADR by reinstalling `standard` and restoring the old script
shape — the underlying source files remain ordinary JS/TS and the
working tree's StandardJS conformance is recoverable by running
`standard --fix` once.
