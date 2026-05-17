# 5. Bump Vite to 7.x and Trial rolldown-vite

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

| Vite | esbuild |
|------|---------|
| 5.1.x  | `^0.19.0` |
| 6.0.x  | `^0.24.0` |
| 6.2.x  | `^0.25.0` |
| 7.x    | `^0.25.0` then `^0.27.0` (latest 7.3.x) |
| 8.x    | `^0.27.0` |

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

2. **Trial `rolldown-vite@7.3.1`** by swapping the `vite` entry to
   `npm:rolldown-vite@7.3.1`.
   - Run the same acceptance checks. If anything fails or surfaces
     warnings that aren't easily resolved, revert to vanilla Vite 7
     in the same commit and document what tripped.
   - If it works cleanly, leave it in. The ADR captures the trial
     so future contributors know why the `vite` entry has the
     `npm:` alias.

We do **not** bump to Vite 8 in this round. Vite 8 forces
`@vitejs/plugin-react@6`, both of which are recent. Re-evaluating
when rolldown-vite ships a Vite-8-mirrored release is fine; this
ADR can be superseded then.

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

If the rolldown-vite trial succeeds, we get the bundler's Rust speed
on the dev server's pre-bundle step and on production builds. If it
fails or regresses something subtle, we revert the alias in one
line. Either way, the experiment lives in version control so future
attempts have a baseline to compare against.

The ADR convention from prior records (one ADR per architectural
decision) is stretched slightly here by bundling two changes. The
justification is that they share a single decision boundary —
"which bundler are we on?" — and bisecting the smaller of the two
without the other doesn't make sense.
