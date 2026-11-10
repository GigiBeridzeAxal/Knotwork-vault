---
type: system
status: live
created: 2026-10-29
updated: 2026-11-10
tags: [system, cloudflare, site]
repo: https://github.com/GigiBeridzeAxal/gigiberidze.com
url: https://gigiberidze.com
stack: [Next.js static export, Cloudflare Workers static assets]
---
# gigiberidze.com

Gigi's portfolio site.

## How it runs
- A **Cloudflare Worker named `gigiberidze`** serving static assets (`output: "export"`, assets from `./out`, config in `wrangler.jsonc`). It is not Cloudflare Pages, even though that was the first guess.
- **Workers Builds** is connected to GitHub (Cloudflare GitHub App, scoped to this repo only), since 2026-10-29.
  - Push to `main`: `npm run build` then `npx wrangler deploy`. **Merging to main is a production deploy.**
  - Other branches: `npx wrangler preview`, which needs a `"previews": {}` block in `wrangler.jsonc` (added in PR #4). See [[Fix red preview build]].
- DNS is on Cloudflare nameservers.

## Site content
- Process section with Gigi's four steps (setup agents and vaults, infrastructure, automated agents, ship).
- Work section: 3 slots in `src/components/site/work.tsx`. The first is [[Knotwork]] (PR #7, merged 2026-11-10), linking to its case study page `/work/knotwork` and the live demo; the other two are placeholders.
- Case study pages live under `src/app/work/<name>/page.tsx`, with screenshots in `public/media/<name>/`. See [[Update the Knotwork case study and docs]].
- Hero links: X, Freelancer, Upwork. No "Hire me" buttons and no Freelancer reviews (removed 2026-10-30 at Gigi's request).
- Contact: mailto `hello@gigiberidze.com` only, no form. See [[Contact email]].

## Gotchas
- Cloud sessions can't reach gigiberidze.com or Cloudflare (egress proxy). Check the live site and dashboard through Gigi's Chrome with Claude in Chrome.
- Largest Contentful Paint was "poor" on half of loads (2026-10-31), caused by the first cover image in the work strip (`web-1-cover.webp`). See [[Traffic analytics]].
- Old Vercel projects `my-portfolio` and `my-portfoliofrontend` are unrelated and stale.

## Local checkout
`C:\Users\PC\Desktop\Gigi's 10k Goal\gigiberidze.com`

## Runbooks and decisions
- [[Deploy gigiberidze.com]]
- [[Fix red preview build]]
- [[ADR-0002 Host the site on Cloudflare Workers with Builds]]
