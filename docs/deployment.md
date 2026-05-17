# Deployment

This site is hosted on **Netlify** (project: `yesitsananias`,
production URL: <https://www.yesitsananias.com>) and uses
**DatoCMS** as its content source. Both pieces have a small set of
moving parts; this doc captures them so the next person doesn't
have to reverse-engineer the Netlify dashboard.

## Topology

```text
┌─────────────────────┐      ┌────────────────────────┐
│  DatoCMS            │      │  GitHub                │
│  graphql.datocms.com│      │  platzhersh/datocms-   │
│  (content + media)  │      │  yes-it-s-ananias-web  │
└──────────┬──────────┘      └──────────┬─────────────┘
           │ runtime fetch              │ webhook on push to main
           │ via @apollo/client         ▼
           │                ┌────────────────────────┐
           │                │  Netlify build         │
           │                │  pnpm install →        │
           │                │  pnpm run build →      │
           │                │  publish build/        │
           │                └──────────┬─────────────┘
           │                           ▼
           │                ┌────────────────────────┐
           └───────────────▶│  www.yesitsananias.com │
                            │  (Netlify edge)        │
                            └────────────────────────┘
```

Two systems, one runtime dependency: the deployed SPA fetches
DatoCMS content live from the browser using
`VITE_APP_DATO_API_TOKEN`. There is no content pre-rendering or
build-time snapshot; if DatoCMS is down, the site loads but shows
the loading placeholders until requests time out.

## Source repository

- **GitHub**: `platzhersh/datocms-yes-it-s-ananias-web`
- **Deploy branch**: `main`. A push triggers a production deploy.
- **Pull requests**: get Netlify deploy previews automatically
  (one ephemeral URL per PR head; visible as a check on the PR).

## Build pipeline

Netlify auto-detects the package manager from the lockfile in the
repo. Because we ship `pnpm-lock.yaml` and declare
`packageManager: "pnpm@11.1.2"` in `package.json`, Netlify uses
**pnpm via corepack** at the pinned version. No global install of
pnpm is needed on the build image.

The build itself runs `pnpm run build`, which expands to
`tsc && vite build` (see `package.json` scripts). Output goes to
`build/`, which `netlify.toml` declares as the publish directory.

### `netlify.toml`

The whole config:

```toml
[build]
command = "pnpm run build"
publish = "build"

[build.environment]
NODE_VERSION = "24.15.0"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[[plugins]]
package = "@netlify/plugin-lighthouse"
```

- **`command`** and **`publish`** override the corresponding dashboard
  settings (Build & deploy → Build settings). Keeping them in
  `netlify.toml` makes the config grep-able and version-controlled.
- **`NODE_VERSION`** pins the build runtime to Node 24.15.0. This
  duplicates `.nvmrc`, but having both means the build is
  reproducible even if `.nvmrc` is ever moved or removed.
- The catch-all **`[[redirects]]`** rewrites every URL to
  `/index.html` so client-side routes (Wouter) work — e.g.
  `/releases` resolves to the SPA, not a 404.
- **`@netlify/plugin-lighthouse`** runs Lighthouse against the
  deployed preview and posts the perf / accessibility / SEO / best-
  practices scores as a deploy comment. Non-blocking, informational.

## Environment variables

Configured in the Netlify dashboard at **Project configuration →
Environment variables**. All five are required for a full-featured
production build:

| Variable                  | Purpose                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `VITE_APP_DATO_API_TOKEN` | DatoCMS read-only API token. Without it the site builds but every query 401s at runtime. |
| `VITE_APP_GTM_ID`         | Google Tag Manager container ID. If missing, `initGtm` no-ops and no analytics fire.     |
| `VITE_APP_MAILCHIMP_URL`  | Mailchimp host (e.g. `https://yesitsananias.us21.list-manage.com`).                      |
| `VITE_APP_MAILCHIMP_U`    | Mailchimp user ID.                                                                       |
| `VITE_APP_MAILCHIMP_ID`   | Mailchimp list ID.                                                                       |

The Mailchimp triplet is consumed by `MailchimpSignupForm` to
build the POST URL; if any of the three is missing the form
component renders `null` (with a dev-only console warning), so the
footer simply hides the newsletter signup rather than showing a
broken control. The site otherwise functions.

Vite only exposes vars with the `VITE_APP_` prefix to the client
bundle; this is enforced at compile time, not runtime. If you add
a new variable, make sure the prefix matches.

### Updating env vars

1. Netlify dashboard → **Project configuration → Environment
   variables**.
2. Add / edit the value.
3. Trigger a redeploy: **Deploys → Trigger deploy → Clear cache
   and deploy site** (cache-clear is needed because Vite inlines
   the values into the JS bundle at build time — without a clean
   build the old value persists in cached chunks).

## DatoCMS

- Console: <https://yesitsananias.admin.datocms.com> (you'll need
  to be invited as a project member).
- Content schema: queryable at the GraphQL endpoint
  <https://graphql.datocms.com>; the inline queries in
  `src/components/**/*.{jsx,tsx}` use this endpoint via
  `@apollo/client`.
- DatoCMS is **not** webhooked into Netlify deploys by default. A
  content update in DatoCMS does not trigger a Netlify rebuild,
  but it also doesn't need to — the site fetches content at
  runtime, so the update is visible on next page load.
- If a schema change introduces a new query field, the
  TypeScript type-check (`pnpm tsc --noEmit`, run as part of
  `pnpm build`) will not catch the mismatch until something
  references the field. There is no codegen step that pulls the
  DatoCMS schema into local types.

## Common operations

### Trigger a redeploy of the current `main`

- Netlify dashboard → **Deploys → Trigger deploy**.
- Use **Clear cache and deploy site** if env vars or
  `pnpm-lock.yaml` changed; otherwise the incremental build is
  fine.

### Roll back to a previous deploy

- Netlify dashboard → **Deploys**.
- Open a successful previous deploy → **Publish deploy**.
- This makes that build the current production version without
  touching the GitHub repo. Useful for fast recovery while a
  fix-forward PR is in flight.

### Read deploy logs

- Netlify dashboard → **Deploys → click any deploy**.
- Logs include the pnpm install output, the `tsc + vite build`
  output, and the Lighthouse plugin's results.
- **Visibility is set to public** in the current configuration
  (Build & deploy → Build settings → Deploy log visibility). If
  the logs ever start containing anything you don't want public,
  flip that.

### Add a Netlify Function

- The dashboard lists `netlify/functions` as the Functions
  directory, but that directory doesn't exist in the repo today.
- Creating `netlify/functions/<name>.ts` is enough — Netlify will
  pick it up on the next build. No `netlify.toml` change required.

## Things to watch for

- **Build command vs. installer mismatch.** Netlify's installer
  auto-detection (pnpm via lockfile) is separate from the **Build
  command** setting in the dashboard. After the move to pnpm, the
  Build command in `netlify.toml` is `pnpm run build` and should
  stay aligned with the lockfile-based installer choice. If
  someone manually edits the dashboard Build command back to
  `npm run build`, the deploy will still mostly work (npm can
  execute the script), but bin-resolution edge cases against a
  pnpm-installed `node_modules` are a class of bugs not worth
  inviting.
- **Node version drift.** `.nvmrc` and `netlify.toml`
  `NODE_VERSION` both declare 24.15.0. Bump them together.
- **Lighthouse plugin regressions.** The plugin runs on every
  deploy. If a deploy starts failing with Lighthouse errors,
  check the deploy log; usually it's a transient timeout on the
  audited URL. The plugin can be temporarily disabled by
  commenting out the `[[plugins]]` block.
