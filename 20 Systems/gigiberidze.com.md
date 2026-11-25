---
type: system
status: live
created: 2026-10-29
updated: 2026-11-25
tags: [system, cloudflare, site]
repo: https://github.com/GigiBeridzeAxal/gigiberidze.com
url: https://gigiberidze.com
stack: [Next.js static export, Cloudflare Workers static assets]
---
# gigiberidze.com

Gigi's portfolio site.

## How it runs
- A **Cloudflare Worker named `gigiberidze`** serving static assets (`output: "export"`, assets from `./out`, config in `wrangler.jsonc`). It is not Cloudflare Pages, even though that was the first guess. Pages are static files and run no Worker code. Only `/api/*` runs the Worker's code (`worker/`, `run_worker_first`), for the site assistant below, once PR #15 is merged.
- **Workers Builds** is connected to GitHub (Cloudflare GitHub App, scoped to this repo only), since 2026-10-29.
  - Push to `main`: `npm run build` then `npx wrangler deploy`. **Merging to main is a production deploy.**
  - Other branches: `npx wrangler preview`, which needs a `"previews": {}` block in `wrangler.jsonc` (added in PR #4). See [[Fix red preview build]].
- DNS is on Cloudflare nameservers.

## Site content
- Process section with Gigi's four steps (setup agents and vaults, infrastructure, automated agents, ship).
- Work section: `src/components/site/work.tsx` lists only finished projects (the two empty placeholder slots were removed on 2026-11-10, PR #11, because they read as unfinished work). Today that is [[Knotwork]] and [[Rouse]] (added 2026-11-15, PR #12, live as `cd9bad0`), each linking to its case study (`/work/knotwork`, `/work/rouse`) and its live site. With two projects the stacked-pile animation runs. Add a project by adding an entry to `PROJECTS`.
- **Rouse's book** (`src/components/site/rouse-showcase.tsx`): pitch, three numbers ($0 a month, 6 MCP tools, 15 min longest ladder), the alert ladder (push, alarm, call shown as "next up" because calls aren't built), and tabs with the alert, Claude's Allow screen and the paired iPhone. The Wake eye is redrawn for dark pages in `rouse-mark.tsx`. The Rouse repo is private: never link to its code. Live links go to https://rouse.gigiberidze.com. When calls ship or the tool count or test count changes, update the book and the case study's `NUMBERS` and chapter 08 together.
- Rouse screenshots (`public/media/rouse/`) come from a local Rouse build on its in-memory test database (`E2E_FAKE_DB=1`, then `SHOTS=... node e2e/mcp.mjs` and `e2e/devices.mjs` in the Rouse repo), so no real account shows.
- **Live demo links go to https://knotwork.gigiberidze.com, the main domain**, never to a workflow page or `/demo?next=...` (Gigi, 2026-11-10, PR #10). The front page has sign-up and "try the demo account".
- The Knotwork book has its own inside (PR #8, 2026-11-10): pitch, three numbers, the seven agents that built it (lead, designer, builder, reviewer, browser testers, operator, archivist) and a plate with Product, Agents and Vault tabs. Agent marks and the animated vault crystal are in `src/components/site/crew.tsx`, reused by the case study's chapter 07. Their numbers come from the case study and this vault; update them together.
- Case study pages live under `src/app/work/<name>/page.tsx`, with screenshots in `public/media/<name>/`; their shared `Chapter` and `Shot` parts are in `src/components/site/case-study.tsx`. See [[Update the Knotwork case study and docs]].
- Hero links: X, Freelancer, Upwork. No "Hire me" buttons and no Freelancer reviews (removed 2026-10-30 at Gigi's request).
- Contact: mailto `hello@gigiberidze.com` only, no form. See [[Contact email]].

## SEO and AI discoverability
Stage 1 of the plan (https://claude.ai/artifact/XfkUkmfsM57RH45qQ29eZW) is live: PR #13, merged on Gigi's OK on 2026-11-25 (`3ff015b`). See [[ADR-0033 Be findable by search and AI assistants with plain facts]].
- Shared facts (name, role "Agentic Engineer & AI Architect", profile links, services, sitemap pages) live in `src/lib/site.ts`. Change them there first, then `public/llms.txt` and `public/llms-full.txt`, which are plain files.
- Structured data (schema.org JSON-LD) is built in `src/lib/schema.ts`: Person on a ProfilePage (home, `/about`), WebSite, SoftwareApplication for each case study, Service and FAQPage on the service pages. Rule: everything in it is also visible on the page.
- `src/app/sitemap.ts` and `src/app/robots.ts` build `sitemap.xml` and `robots.txt` (all crawlers allowed, AI crawlers named). Cloudflare adds its own "content signals" comment text to `robots.txt`.
- Pages added: `/about`, `/services/agentic-engineering`, `/services/ai-architecture`, `/services/mcp-servers`, `/ka` (Georgian summary, Noto Sans Georgian), and a `noindex` 404.
- No prices on the site, no city (country only), no invented clients or reviews.
- Before this (audit 2026-11-25): 3 pages, no sitemap, no llms.txt, no structured data, and a web search for the name returned other people.
- **FAQ** (PR #14, live 2026-11-25): `/faq` has 35 questions in six groups. Every question and answer lives in `src/lib/faqs.ts`; `/about`, the service pages and `/ka` (eight in Georgian) show subsets, so one question has one answer everywhere. Where Gigi has stated no policy (code ownership, NDA, support, data terms) the answer says it is agreed per project. Change those answers when Gigi states a policy.
- **IndexNow**: `npm run indexnow` (script `scripts/indexnow.mjs`) tells Bing and other engines which pages changed. Run it by hand after a deploy that adds or changes pages. Its key file in `public/` is public by design.
- **Google Search Console**: property `https://gigiberidze.com` (URL prefix) under Gigi's Google account, verified by the file `public/google3a1a9b0fc032fa53.html` on 2026-11-25; `sitemap.xml` submitted the same day (9 pages found). IndexNow was also sent for all 9 pages that day. Never delete that file. The Domain property `gigiberidze.com` (all subdomains) was verified on 2026-11-25 by a `google-site-verification` TXT record at the root of the Cloudflare DNS zone; it lists the same sitemap. Never delete that record.
- **Bing Webmaster Tools**: site `https://gigiberidze.com/` under Gigi's Microsoft account, verified on 2026-11-25 by a CNAME record in Cloudflare DNS that points to `verify.bing.com` (DNS only; never delete it); `sitemap.xml` submitted the same day. Bing's index also feeds ChatGPT search and Copilot.
- **Cloudflare and AI crawlers** (checked 2026-11-25): AI Crawl Control blocks no crawler (33 listed, none blocked, no failed requests), and Bot fight mode and AI Labyrinth are off. Keep it that way, or the assistants cannot read the site.
- Next stages: one identity across profiles, mentions outside the site, a monthly check with fixed questions to the assistants.

## Site assistant (Onyx)
A chat on every page that answers visitors about Gigi, the services, the projects and how to hire, on a free Workers AI model. See [[ADR-0034 The site assistant answers from the site's facts on a free model]].
- **Status:** live since 2026-11-25. PR #15 merged on Gigi's OK (`8a5d251`).
- **Code:** `worker/` is the server, `POST /api/chat`. `src/components/assistant/` is the chat window: the corner button and the character load with every page, and the window loads on first open.
- **Facts:** `src/lib/site.ts`, `src/lib/faqs.ts` and `public/llms-full.txt`, read when the Worker starts. Change a fact on the site and the assistant changes on the next deploy.
- **Model:** `@cf/google/gemma-4-26b-a4b-it`, thinking off. When it fails, or the free allowance (10,000 neurons a day) is spent, the chat gives the closest FAQ answer until 00:00 UTC.
- **Name:** change `ASSISTANT_NAME` in `src/lib/site.ts` and `CHAT_NAME` in `wrangler.jsonc` together. A test keeps them equal.
- **Limits:** same-site requests only, 8 KB body, 500 characters a message, 20 questions a chat (the window enforces it; the server checks it as a backstop), 8 messages a minute per address. Previews use the same rate limit. Replies naming a price or rate are replaced by a fixed line. No chat text is stored or logged.
- **Commands:** `npm test` (unit tests), `npm run e2e` (browser tests against a running Worker). See [[Test the site assistant]].
- Plan: https://claude.ai/artifact/A4SioXA9jUbV6Ludh7Dnu9. Character sheet: https://claude.ai/artifact/Ab6CepTiUzmQfngA4evcLU.

### Onyx speaks first (the script)
He greets every visitor and comments on his own from about 580 prewritten lines, picked in the browser, with no model and no network. See [[ADR-0035 Onyx speaks first from a script kept in the visitor's browser]].
- **Status:** PR #16 squash-merged as `7903a8d` on Gigi's OK on 2026-11-25 (deploys on merge). Still open: Gigi's proofread of the Georgian lines; not tried on real phones, Safari, Firefox or a screen reader.
- **Where:** lines in `src/components/assistant/script/lines/` (`english.ts` joins the English files, `georgian.ts` is all Georgian). Engine `script/engine.ts`, choice `script/pick.ts`, pacing `script/pace.ts`, memory `script/memory.ts`, bubble `bubble.tsx`.
- **Add or change a line:** edit the object in the matching file (`id`, `on`, `text`, `mood`, optional `anim`, `target`, `when`, `repeat`, `weight`, `chip`, `lang`; shape in `script/types.ts`), then `npm test`. A line that quotes a number from a page must change when the page does; the test checks the form, not the facts.
- **Triggers:** arrive, return, page, section, hover, click, idle, long read, fast scroll, bottom, tab back, leaving, selected text, copied email, pokes, pointer near, the chat, 404, mute and unmute.
- **Pacing:** 25 s between lines he offers, at most 6 a page; hovers at most 2 a page and 6 a visit; clicks at most 3 a page; 20 a visit for all of these together. Nothing while typing or with the chat open.
- **Language:** Georgian on `/ka` (no English fallback there) and for browsers set to Georgian.
- **Remembered,** in the visitor's `localStorage` only: visits, pages seen, lines said, mute (`onyx-memory-v1`), cleared after 180 days without a visit; the chat (`onyx-chat-v1`) for 30 days from the last message. "Forget me" in the chat window clears both.
- **Debug:** `?onyx=debug` on any page logs every event and choice in the console and opens `window.__onyx` (`fire`, `show`, `skip`, `state`, `reset`). It works on the live site on purpose: it changes only your own tab. See [[Test the site assistant]].

## Gotchas
- `npm run build` stops every other run with a Next.js security advisory notice. Run it again and it continues. The advisories need the Next server runtime, which a static export does not use, so they do not apply. Upgrading Next to 16.4.5 or later would silence the notice.
- Cloud sessions can't reach gigiberidze.com or Cloudflare (egress proxy). Check the live site and dashboard through Gigi's Chrome with Claude in Chrome.
- Largest Contentful Paint was "poor" on half of loads (2026-10-31), caused by the first cover image in the work strip (`web-1-cover.webp`). See [[Traffic analytics]].
- Old Vercel projects `my-portfolio` and `my-portfoliofrontend` are unrelated and stale.

## Local checkout
`C:\Users\PC\Desktop\Gigi's 10k Goal\gigiberidze.com`

## Runbooks and decisions
- [[Deploy gigiberidze.com]]
- [[Fix red preview build]]
- [[ADR-0002 Host the site on Cloudflare Workers with Builds]]
- [[ADR-0033 Be findable by search and AI assistants with plain facts]]
- [[ADR-0034 The site assistant answers from the site's facts on a free model]]
- [[ADR-0035 Onyx speaks first from a script kept in the visitor's browser]]
- [[Test the site assistant]]
