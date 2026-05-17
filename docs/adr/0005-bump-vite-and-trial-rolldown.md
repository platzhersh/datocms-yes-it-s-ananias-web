# 5. Bump Vite and Adopt Built-in rolldown

Date: 2026-05-17

## Status

Accepted

## Context

The previous ADR-0004 (pnpm switch) surfaced two oddities about the
project's bundler:

1. Two `esbuild` versions live in the install tree:
   - `esbuild@0.19.12`, pulled in by Vite 5.1.1 (our direct dep);
   - `esbuild@0.27.7`, pulled in directly by Storybook 10's
     `@storybook/csf-plugin` and `storybook` packages (they call
     esbuild for their own code transforms, independent of Vite).
     pnpm keeps the two installs isolated in the store, but they're
     still two downloads, two binaries, two attack surfaces. The cost
     isn't catastrophic — esbuild is a few MB per platform binary —
     but it's an avoidable duplicate.
2. We're two majors behind on Vite. The 5.1.1 we have was released
   in February 2024; the current line is Vite 7 (latest 7.3.3) with
   Vite 8 already published. Vite 5 has dropped off the
   release-notes radar and the ecosystem is moving on.

The post-pnpm investigation also raised a separate but adjacent
question: are there alternatives to esbuild? The short answer is
"yes, but only by replacing Vite, and the only credible option
is rolldown-vite, which is still pre-stable." Rather than treat
that as a separate decision, this ADR bundles a Vite bump with a
time-boxed rolldown-vite trial so both can be reasoned about in one
place.

Constraints from existing tools:

- `@storybook/react-vite@10.4.0` peers `vite: ^5 || ^6 || ^7 || ^8`,
  so Storybook 10 is happy with anything from 5 through 8.
- `@vitejs/plugin-react@4.2.1` (current) peers `vite: ^4.2.0 || ^5.0.0`
  — too restrictive for Vite 6+.
- `@vitejs/plugin-react@5.x` peers `vite: ^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0`.
- `@vitejs/plugin-react@6.x` (latest) peers `vite: ^8.0.0` only.
- `vite-tsconfig-paths` and `vite-plugin-babel-macros` are
  Vite-version-agnostic.

Esbuild alignment is the deciding factor. Vite-version-to-esbuild
relationships in the relevant range:

| Vite  | esbuild                                 |
| ----- | --------------------------------------- |
| 5.1.x | `^0.19.0`                               |
| 6.0.x | `^0.24.0`                               |
| 6.2.x | `^0.25.0`                               |
| 7.x   | `^0.25.0` then `^0.27.0` (latest 7.3.x) |
| 8.x   | `^0.27.0`                               |

**Vite 7.3.x** is what aligns with Storybook 10's `esbuild@0.27.7`
direct dep. Vite 8 would also align, but requires
`@vitejs/plugin-react@6`, which is the bleeding edge and peers
strictly on Vite 8 — locking us out of rolldown-vite (which
currently mirrors Vite 7).

### rolldown-vite

`rolldown-vite@7.3.1` is published as a drop-in replacement for the
`vite` package. The substitution is done via the `npm:` alias
syntax in `package.json`:

```jsonc
{
  "dependencies": {
    "vite": "npm:rolldown-vite@7.3.1"
  }
}
```

Code continues to `import * as vite from 'vite'`; the runtime
implementation is rolldown's. The Vite team publishes both packages
in lock-step and treats rolldown-vite as the eventual replacement.
It's still pre-stable — the project recommends piloting it in
non-critical environments and reverting if anything breaks. The
swap is a one-line `package.json` change either way, so the
revert cost is negligible.

## Decision

Two steps, landed as separate commits so the bisect surface stays
small:

1. **Bump Vite to 7.3.3 and `@vitejs/plugin-react` to 5.2.0.**
   - This collapses the esbuild duplication: Vite 7 wants `^0.27.0`,
     Storybook 10 wants `^0.27.0`, so pnpm picks one version
     (currently `0.27.7`) and shares it.
   - Vite 7 is two majors of breaking changes from 5.1, but the
     migration impact on this project is small — we use
     `@vitejs/plugin-react`, `vite-tsconfig-paths`, and
     `vite-plugin-babel-macros`. None of those use Vite APIs that
     were removed in 6 or 7.
   - Acceptance: `pnpm build` and `pnpm build-storybook` produce
     equivalent output; bundle sizes within 10% of the Vite 5
     baseline; dev server starts.

2. **Adopt rolldown via a Vite 8 bump** (changed from the original
   "trial `rolldown-vite@7.3.1` via npm: alias" plan).
   - The `rolldown-vite@7.3.1` package was discovered to be
     **deprecated on publish** during the trial: npm's install log
     reads "Use this package to migrate from Vite 7 to Vite 8."
     The Vite team's intended migration path is now to use Vite 8
     itself, which has `rolldown: 1.0.1` as a **direct dependency**.
     rolldown is no longer an "alias trick" — it's the bundler that
     Vite 8 ships with.
   - Concretely: bump `vite` to `8.0.13` and
     `@vitejs/plugin-react` to `6.0.2`. Plugin-react 6 declares
     `@rolldown/plugin-babel` and `babel-plugin-react-compiler` as
     **optional** peers — neither is needed unless the codebase
     opts into them, so the install is clean without them.
   - Storybook 10 supports Vite 8 (`vite: ^5 || ^6 || ^7 || ^8`),
     so this bump propagates cleanly through the Storybook side.

The intermediate Vite 7 bump from step 1 stays as a separate commit
so the diff between Vite 5 and Vite 7 (the conventional ecosystem-wide
move) and the diff between Vite 7 and Vite 8 (the rolldown adoption)
can be bisected independently.

## Consequences

A successful Vite 7 bump removes ~5–10 MB of duplicated `node_modules`
weight (one of the two `esbuild` per-platform binary stacks goes
away), and brings us within striking distance of the current Vite
release line.

The Vite 5 → 7 jump skips one major version (6). The Vite changelog
flags a few breaking changes in that range:

- Node 18 is dropped as a minimum (we're on 24 already).
- Some `server.fs.strict` defaults changed (we don't customise these).
- `import.meta.glob` syntax restrictions tightened slightly (we
  don't use it).
- HTML transform plugin API changed (we don't have custom plugins
  in that lane).

None of these touch our codebase. If the build surfaces a warning,
it'll be tracked in a follow-up commit on the same branch.

**Measured result of the Vite 8 + rolldown adoption:**

- Production `vite build` time: **~3.5 s → 452 ms** (~8× speed-up).
- Main entry bundle: 458.29 KB → 450.93 KB (raw); 147.66 KB → 143.86 KB
  (gzipped). rolldown's chunking differs slightly from rollup's —
  a few small chunks (e.g. `ExternalLink`, `StructuredText`) are
  now split out into their own files instead of being inlined,
  which mostly pays off the main chunk's small size reduction.
- `pnpm lint`, `pnpm tsc --noEmit`, and `pnpm build-storybook`
  all pass unchanged.

If rolldown later regresses something subtle in production, the
revert is `vite@7.3.3 + @vitejs/plugin-react@5.2.0` (the
step-1 state preserved in commit history). The codebase itself
has no rolldown-specific code; the swap is contained in package.json.

The ADR convention from prior records (one ADR per architectural
decision) is stretched slightly here by bundling two changes. The
justification is that they share a single decision boundary —
"which bundler are we on?" — and bisecting the smaller of the two
without the other doesn't make sense.
