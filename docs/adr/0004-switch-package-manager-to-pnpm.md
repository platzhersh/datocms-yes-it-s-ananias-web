# 4. Switch Package Manager from Yarn Classic to pnpm

Date: 2026-05-17

## Status

Accepted

## Context

The project uses **Yarn Classic v1.22.22** for installs and script
running. Yarn v1 went into maintenance-only mode in early 2022 and
hasn't received feature work in several years. It still works, but
every other dimension of the tooling has moved on: we just landed
oxlint/oxfmt (ADR-0003), Storybook 10 (ADR-0002), Node 24 (ADR-0002),
and Apollo Client 3 (ADR-0001 phase 5). The package manager is the
oldest piece of the toolchain by a wide margin.

Four credible replacements were considered.

### Yarn Berry (v4)

The "modern Yarn." Two install strategies:

- **Plug'n'Play (PnP)** — no `node_modules` directory; resolutions
  go through a `.pnp.cjs` map. Very fast and disk-efficient. **But**
  several tools in this codebase do not handle PnP well: Storybook
  addons that walk `node_modules` directly, `babel-plugin-macros` /
  `graphql.macro` which resolves files by path, and a few of the
  pre-1.0 oxc Rust binding packages. Workable, but painful.
- **`nodeLinker: node-modules`** — drops PnP and uses a normal
  `node_modules`. At that point most of Berry's advantage over
  pnpm disappears, and you've still adopted Berry's idiosyncratic
  `.yarnrc.yml` + `.yarn/` directory tree.

### npm (Node's bundled package manager)

Already installed everywhere Node is. v10 is meaningfully faster than
v6/v7 of past pain. Lockfile is a verbose `package-lock.json` that
makes review noisy on PRs. Slowest of the four at installs (still on
the order of seconds for this project, so not a deal-breaker). No
phantom-dependency protection. Safe baseline, no real upside.

### pnpm

A content-addressable global store + hard links into a `node_modules`
that follows the strict resolution rules npm doesn't enforce.
Concretely:

- ~2–3× faster than npm, comparable to or slightly faster than
  Yarn v1 for this project's dep graph.
- A single global store dedupes packages across all of a developer's
  projects, so disk usage on a multi-project laptop drops sharply.
- Strict mode catches **phantom dependencies** — a package importing
  something that is in the tree but not in its own `dependencies`
  list. This is a real quality gate; most projects discover they
  have a few once they switch.
- Lockfile is `pnpm-lock.yaml` (text, compact, reviewable).
- Mature (released 2017), used by Vue, Vite, Microsoft, Prisma,
  Cloudflare, and many others, so ecosystem support is uncontroversial.
- Excellent CI story: `pnpm/action-setup` is one line in a GitHub
  Actions workflow.

Cost: the strict mode may surface 1–2 phantom-dep warnings on first
install. If a dependency is genuinely broken, the escape hatch is
`public-hoist-pattern` or `node-linker=hoisted` in `.npmrc`, but it
should rarely be needed.

### bun

The fastest installer of the bunch (a 5–10× speedup over npm is
typical) and bundles a JS runtime besides. For our purposes only
`bun install` matters — Vite remains the build tool.

Why we did **not** pick bun:

- The lockfile (`bun.lock`, recently text-based; older `bun.lockb`
  was binary) is newer than pnpm's and has fewer years of edge-case
  hardening.
- bun's package-manager mode has had compatibility wrinkles with
  packages that ship native bindings (a few of which we use, e.g.
  the oxc Rust bindings). The mode has matured a lot, but the risk
  surface is non-trivially larger than pnpm.
- Netlify build images do not pre-install bun by default; we would
  need to install it in the build step. Pre-installation of pnpm via
  `corepack` is built into Node 16+.

Bun would not be a wrong choice; it just trades a margin of speed for
a larger compatibility surface than we want on a production-deployed
band website maintained by one or two people.

## Decision

**Switch from Yarn Classic to pnpm**, via Node's built-in `corepack`
mechanism so the version is pinned in `package.json` and contributors
do not need a manual `npm install -g pnpm` step.

Concrete changes:

1. Add `"packageManager": "pnpm@11.1.2"` to `package.json`. Corepack
   (built into Node ≥ 16, fully on by default in Node 24) will read
   this field and use the right pnpm version when contributors run
   `pnpm install`.
2. Run `pnpm import` once to translate `yarn.lock` into
   `pnpm-lock.yaml`, then delete `yarn.lock`.
3. Verify `pnpm install`, `pnpm build`, `pnpm build-storybook`,
   `pnpm lint`, `pnpm format:check` all pass. Triage any
   phantom-dep warnings that come out of strict mode; add minimal
   `public-hoist-pattern` entries to `.npmrc` only if a dependency
   genuinely cannot be fixed.
4. Update `.github/workflows/ci.yml`: replace the `setup-node` +
   `yarn install` steps with `pnpm/action-setup` + `pnpm install
--frozen-lockfile`. Update the cache to point at pnpm's store.
5. Update CLAUDE.md commands and the README badge if any.
6. Leave the existing `.npmrc` `save-exact=true` in place — pnpm
   honours it for `pnpm add` the same way Yarn did.
7. Leave the Storybook resolution pins (`resolutions` block) alone
   for now; pnpm's equivalent is `overrides` in `package.json`, but
   the existing pins are SB6-era leftovers that no longer apply
   (separate cleanup tracked elsewhere).

Acceptance: a fresh `pnpm install` from clean checkout reproduces the
green build + lint + storybook-build that the Yarn-based CI was
running on the previous commit.

## Consequences

Local dev install is faster and less disk-hungry, especially for
anyone working on multiple Node projects. The lockfile change
(`yarn.lock` → `pnpm-lock.yaml`) is a one-time noisy diff that should
land in its own commit so future PRs aren't muddied by it.

Strict dependency resolution may surface bugs in packages that have
been relying on hoisting; the fix when it happens is a small
`public-hoist-pattern` entry in `.npmrc` (still text, still
reviewable). If a particular package can't be coaxed into working,
the nuclear option is `node-linker=hoisted`, which gives us the
old npm-style tree without losing pnpm's other benefits.

Contributors will need pnpm available. With corepack on, that means
having any Node ≥ 16 — pnpm itself is downloaded on first `pnpm`
invocation per version. The README and CLAUDE.md will be updated
to reflect the new commands so the on-ramp is obvious.

Netlify auto-detects pnpm when it sees `pnpm-lock.yaml` and runs the
right install. No `netlify.toml` change is required, but the field
can be made explicit if a future deploy ever picks the wrong manager.

If pnpm later proves unworkable for a specific package or workflow,
reverting is a single commit: restore `yarn.lock`, drop the
`packageManager` field, swap the CI workflow back. The codebase
itself doesn't depend on pnpm-specific features.
