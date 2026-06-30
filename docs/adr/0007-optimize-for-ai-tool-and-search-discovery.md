# 7. Optimize for AI-Tool and Search Discovery

Date: 2026-06-30

## Status

Accepted (implemented 2026-06-30 in commit a65b6db)

## Context

The site is a client-rendered React SPA (Vite + Wouter + Apollo). The
deployed `index.html` is an empty shell — a single `<div id="root">`
plus a `<script type="module">` that boots React, which then fetches
all content from DatoCMS at runtime in the browser (see
`docs/deployment.md`: "There is no content pre-rendering or build-time
snapshot"). Every page's text, release list, discography, show
listings and bio exist only after JavaScript has run and the Apollo
queries have resolved.

This is a problem for a class of consumers that read HTML **without
executing JavaScript**:

- **AI assistants and answer engines** — OpenAI's GPTBot / OAI-SearchBot
  / ChatGPT-User, Anthropic's ClaudeBot, PerplexityBot, Google-Extended,
  Applebot-Extended, Common Crawl's CCBot. Several of these do not run
  a full browser runtime; they fetch the raw HTML. Against our shell
  they saw almost nothing — a generic title and a one-line description
  that was also stale ("'YIA IV' New Album OUT 15.09.2023").
- **Link-preview unfurlers** — Slack, iMessage, WhatsApp, Discord,
  Facebook, X. These read Open Graph / Twitter Card tags from the
  static HTML, which we did not emit, so shared links rendered with no
  image, title or description.
- **Search-engine crawlers** that do render JS (Googlebot) still
  benefit from explicit structured data and a sitemap, neither of
  which existed. `public/robots.txt` was a 0-byte file, so there was
  no sitemap pointer and no explicit crawler guidance.

The artist's *identity* — name, genre, the streaming/social profiles,
the booking contact — is **stable and already hard-coded** in the
codebase (`molecules/SocialMediaLinks.tsx`, `molecules/Contact.tsx`,
`molecules/Header.tsx`). It does not depend on a DatoCMS round-trip.
That means the high-value discovery signals can be emitted statically
in `index.html` and in static files under `public/`, with no rendering
pipeline change.

The deeper gap — per-route *content* (the actual releases, videos,
shows, discography, bio) being invisible to non-JS crawlers — cannot
be closed without a rendering change (SSR/SSG/prerender). That is a
larger architectural decision and is deliberately deferred to its own
record (see ADR-0008). This ADR covers only the static, zero-runtime
signals.

## Decision

Add static, JavaScript-free discovery signals. Six changes, all
additive; none touch the React app or the build pipeline beyond Vite's
existing `public/` copy step.

1. **Enrich the `index.html` `<head>`.**
   - A descriptive, accurate `<title>` ("Yes it's Ananias —
     Contemporary Psycho-Automatic Piano") and a `<meta name="description">`
     that describes the project rather than advertising a single dated
     release. The old description hard-coded a 2023 album date that had
     long since gone stale; the replacement is evergreen.
   - `<link rel="canonical">` to `https://www.yesitsananias.com/`.
   - Open Graph tags (`og:type=music.musician`, `og:title`,
     `og:description`, `og:url`, `og:image`, `og:site_name`,
     `og:locale`) and the matching Twitter Card tags
     (`summary_large_image`).

2. **Embed `MusicGroup` JSON-LD structured data** in `<head>`. A
   `schema.org/MusicGroup` block with `name`, `alternateName`
   ("Ananias"), `description`, `genre`, `url`, `image`, `email`, and a
   `sameAs` array of all seven streaming/social profiles. The values
   are copied verbatim from the existing components, so there is one
   place to keep in sync (noted under Consequences). This is the
   format Google's rich results and most answer engines consume to
   identify an entity.

3. **Add a `<noscript>` fallback** in `<body>`. It mirrors the key
   facts (who/what), the six route links, the booking email, and the
   streaming/social links. This guarantees the page is never
   content-empty when read without a browser runtime, and it degrades
   gracefully: JS-capable clients never see it; the React app renders
   over the `#root` div as before.

4. **Write a real `public/robots.txt`** (was 0 bytes). It `Allow: /`
   for `*` and then enumerates the major AI / answer-engine user
   agents explicitly (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
   Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User,
   Google-Extended, Applebot, Applebot-Extended, Bingbot, CCBot) so the
   intent to allow AI ingestion is unambiguous, and it points to the
   sitemap. Enumerating named agents is belt-and-suspenders over the
   `*` rule — some operators only honour a rule that names their bot.

5. **Add `public/sitemap.xml`** listing all six routes (`/`, `/about`,
   `/releases`, `/videos`, `/shows`, `/discography`) with
   `changefreq`/`priority` hints (shows highest, since it changes most).

6. **Add `public/llms.txt`** — the emerging convention of a curated
   Markdown summary at the site root aimed at LLMs: a one-paragraph
   description, a list of the pages with one-line summaries, and the
   listen/social/contact links. It restates in clean Markdown what the
   JSON-LD encodes for machines.

A stable `public/og-image.jpg` (copied from the existing
`src/assets/portrait_YIA_monir.jpg`) backs the `og:image` and the
JSON-LD `image`. Files in `public/` are copied to the build root
verbatim by Vite, so all of the above ship without any code change.

### Alternatives considered

- **Per-route meta via a head manager** (`react-helmet`-style). Would
  give each route its own title/description, but only for clients that
  execute JS — precisely the clients that already render the full app.
  It does nothing for the non-JS crawlers that are the whole point
  here, while adding a dependency. Rejected for this ADR; per-route
  head control becomes relevant only alongside SSR/SSG (ADR-0008).
- **Server-side rendering / prerendering now.** The correct way to
  expose per-route *content* to non-JS crawlers, but a much larger
  change (routing, data-fetching, possibly hosting). Split into
  ADR-0008 so this cheap, high-leverage layer can ship immediately and
  independently.
- **A landscape (1.91:1) purpose-built OG image.** Best practice for
  unfurl previews. Deferred — reusing the existing portrait is zero-
  cost and functional; a designed card can replace `og-image.jpg`
  later with no markup change.

## Consequences

- Non-JS crawlers and answer engines now receive a coherent identity
  for the project (name, genre, links, contact) plus the `<noscript>`
  fallback, instead of an empty shell. Shared links unfurl with a
  title, description and image.
- **The structured data is duplicated truth.** The `sameAs` URLs,
  booking email and genre now live both in the React components and in
  `index.html`'s JSON-LD / `llms.txt`. If a social URL or the booking
  address changes, both places must be updated. This is an accepted
  cost of having the signals available without a runtime; the
  duplication is small and centralized (one JSON-LD block, one
  `llms.txt`). A future build step could generate these from a single
  source, but that is over-engineering for seven rarely-changing URLs.
- **`sitemap.xml` is hand-maintained.** Adding or renaming a route
  means editing both `App.tsx` and `sitemap.xml`. With six static
  routes this is tolerable; the routes have not changed since 2021. If
  routes ever become data-driven, the sitemap should be generated.
- **Content is still not exposed without JS.** This ADR closes the
  identity gap, not the content gap. A crawler that does not render JS
  still cannot read the release list or show dates. That is the
  explicit boundary with ADR-0008.
- **`llms.txt` is a convention, not a standard.** Not every AI tool
  consumes it, and it has no formal spec guaranteeing longevity. The
  cost of including it is one static file, so the downside is
  negligible even if adoption stalls.
- No change to bundle size, runtime behaviour, or the build command.
  `pnpm build` output is unchanged except for the enriched
  `build/index.html` and the four new files copied from `public/`.
  Verified: the build succeeds and `build/` contains `robots.txt`,
  `sitemap.xml`, `llms.txt` and `og-image.jpg`.
