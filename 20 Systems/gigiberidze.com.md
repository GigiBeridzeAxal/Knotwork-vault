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
- Work section: `src/components/site/work.tsx` lists only finished projects (the two empty placeholder slots were removed on 2026-11-10, PR #11, because they read as unfinished work). Today that is [[Knotwork]], linking to its case study page `/work/knotwork` and the live demo. With one project the card scrolls with the page; the stacked-pile animation starts again from two projects. Add a project by adding an entry to `PROJECTS`.
- **Live demo links go to https://knotwork.gigiberidze.com, the main domain**, never to a workflow page or `/demo?next=...` (Gigi, 2026-11-10, PR #10). The front page has sign-up and "try the demo account".
- The Knotwork book has its own inside (PR #8, 2026-11-10): pitch, three numbers, the seven agents that built it (lead, designer, builder, reviewer, browser testers, operator, archivist) and a plate with Product, Agents and Vault tabs. Agent marks and the animated vault crystal are in `src/components/site/crew.tsx`, reused by the case study's chapter 07. Their numbers come from the case study and this vault; update them together.
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
