---
type: project
status: active
created: 2026-11-15
updated: 2026-11-18
tags: [project, business, clients]
url: https://claude.ai/artifact/CFQBSduzK7XqgQpADcr1wq
---
# Client acquisition

The plan for turning the portfolio into paying clients. Gigi set the direction on 2026-11-16: AI automation, sold on Upwork and Fiverr and by direct messages to US and local businesses ([[ADR-0029 Lead with AI automation on Upwork, Fiverr and direct messages]]). The visual plan (private artifact, version 2) is at the `url` above.

## Positioning
"I automate the repetitive work in your business with AI: answering customers, following up leads, bookings, invoices and reports. Built to run on its own, and cheap to keep running."

- The category is crowded, so the edge to repeat everywhere is reliability: error handling, alerts when something breaks, near $0 a month to run.
- Proof: [[Knotwork]] (a whole automation engine), [[Rouse]] (an AI that reaches a human when it matters), production work on Gigr.
- Custom agents and MCP servers stay on the menu as the specialist, higher-priced offer.

## Offers and starting prices
Starting points from typical market ranges, not measured. First two or three jobs at the low end for reviews, then raise.

| Offer | Price | Time |
|---|---|---|
| **One automation, end to end** (main offer; n8n, Make or custom code) | $400 to $1,500 (first clients $150 to $400) | 3 to 7 days |
| AI assistant for customer messages (site, WhatsApp, Messenger, Instagram; several languages; lower prices for local businesses) | $500 to $2,000 | 1 to 2 weeks |
| Automation audit (plan and a short video; price comes off the build) | $150 to $300 | 2 to 3 days |
| Custom agent or MCP server (50% up front) | $1,500 to $6,000 | 2 to 4 weeks |
| Fiverr gig packages | $100 / $300 / $700 | |
| Care plan, offered at every handover | $100 to $500 a month | ongoing |
| Upwork hourly | $30 to $35, then $45 to $60 after 3 to 5 reviews | |

## Channels
1. **Upwork**: title around AI automation; 2 to 3 proposals a day to fresh jobs with verified payment, opened with a 2 minute video. Connects cost roughly $2 a proposal (about $60 to $100 a month); Upwork keeps around 10%.
2. **Fiverr**: three gigs (AI automation, AI customer assistant, custom agent or MCP server), three packages each, replies within an hour. Free to list; Fiverr keeps 20%. (Gigi changed the three gigs on 2026-11-18, see Freelance profiles below.)
3. **Messages to US businesses**: 10 a day, one business type at a time (home services, clinics, real estate agents, small marketing agencies), naming one problem visible from outside.
4. **Messages to local businesses**: 5 a day in the local language (hotels and tour operators, clinics and salons, online shops, real estate). Lower prices, faster yes, first case studies.

Getting paid does not wait for [[US LLC for Stripe]]: platforms pay out directly, direct clients can pay by invoice or bank transfer.

## Using AI on the sales work
AI prepares, Gigi sends. Fine to automate: job alerts (Rouse can ring the phone), proposal drafts, finding businesses, a reply tracker. Never: bots that send Upwork proposals (against Upwork's rules, accounts get suspended), mass identical messages, replies to interested buyers.

## Daily routine (about 90 minutes)
2 to 3 proposals, 10 US and 5 local messages, same-day replies on Fiverr and everywhere else, follow-ups and the tracker.

Planning guesses for 30 days: 300 messages give about 24 replies, 9 calls, 2 to 3 clients; 50 proposals give about 8 replies, 4 interviews, 1 to 2 clients. Replace with real rates after week two.

## 30-day plan
- **Week 1 (16 to 22 Nov)**: rewrite Upwork, publish three Fiverr gigs, record two demo videos, list 100 US and 100 local businesses, start the routine.
- **Week 2 (23 to 29 Nov)**: routine daily, job alerts to the phone, two demos for interested businesses, meet three local businesses that replied.
- **Week 3 (30 Nov to 6 Dec)**: follow-ups, one low-priced platform job for the first review, one local client as a case study, switch business type if replies are under 5%.
- **Week 4 (7 to 15 Dec)**: deliver early, ask for reviews, offer the care plan, put time into the best channel, raise prices one step, write the first client case study.

## Suggested site changes (not built; need Gigi's OK)
- A "What I automate" section with the four offers and "from" prices.
- One line under the name in the hero saying what Gigi builds. No "Hire me" button, per the 2026-10-30 request.
- Two short demo videos (a lead answered, a booking taken).
- A "Want one like this?" block at the end of each case study.
- A booking link next to the email button (Cal.com free plan).
- A local-language version of the offers section.
- Client quotes after the first two clients.

## Lead research
Briefs on single businesses live in private docs, not here: this vault is public, and a named prospect should not read our notes about them. Record only the pattern.

- **2026-11-16, lead 1 (local clothing retailer, several shops, sells through Instagram DMs):** researched, first message drafted, not contacted yet. Private brief linked from the project thread for this lead.
- **2026-11-17, lead 1:** Gigi asked for a working demo to show instead of a message alone. Built as a private repo (not named here): a store in four languages, an order form, a staff panel and a store assistant ([[ADR-0030 Lead demos are one Cloudflare Worker with a rule-based assistant]]). Version 1 went online the same day.
- **2026-11-17, lead 1, version 2:** Gigi asked for real products, the prospect's own branding, speed, a normal checkout and a panel they can manage. Built and online the same day: items with the prospect's own public photos (items showing other companies' logos left out), cart, checkout with pay on delivery or a test card page (real payments need the shop's own bank account), stock that is reserved and released, limits that keep a public demo from being emptied, demo data restored every night. Not sent yet; next is the pitch pack (short video and message).

### Playbook: clothing and shoe shops that sell on Instagram
- **Signs to look for:** no website, "order by DM" in the bio, free delivery, many posts and videos, many Google reviews with no owner replies, reviews in several languages (tourist areas).
- **Lead offer:** a DM assistant on Instagram and Facebook (Meta's official messaging API) that answers price, size, stock, delivery and address in the customers' languages and hands the order to staff.
- **Follow-on offers:** comment-to-DM replies, drafted Google review replies that staff approve, a shared product sheet as the bot's memory, an order tracker with delivery updates, sale broadcasts to opted-in buyers.
- **Demo that lands:** a 2 minute video of a test account answering about the shop's own posted items.
- **Guardrail:** the bot never claims an item is original or answers authenticity questions; it passes those to staff.
- **Demo store that can be reused for the next shop of this kind:** catalog with size and price filters, order form without payment, staff panel (orders, stock per shop, phone photos), assistant that answers from live stock, review reply drafts. Sample items only, a "demo, not the official site" notice on every page, hidden from search. What the checks showed: test the pages in the shop's languages with a native reader, test on an iPhone, and keep the staff passcode out of the page before sending the link.
- **Starting price guess (local):** about $370 to $930 setup plus $55 to $110 a month for the DM assistant; a 2 week Instagram-only pilot first. Not tested.

## Freelance platform automations (plan, 2026-11-18)
Gigi asked for automations on Upwork, Fiverr and Freelancer.com. Plan (private artifact, not built, waiting for Gigi's OK): a "Freelance Lead Desk" that collects new jobs, scores them by rules, drafts a proposal and alerts Gigi's phone; Gigi sends every proposal by hand.
- **Sources:** Upwork's own saved-search alert emails and Fiverr notification emails, forwarded to a new Email Routing address on the site's domain; Freelancer.com through its official developer API, polled by a [[Knotwork]] workflow.
- **Platform rules checked 2026-11-18:** Upwork switched off RSS and treats scripts or extensions that search or act faster than a human as bots (warnings, restriction or ban); its API needs a key approved for that use. Fiverr has no public seller API and bans spam, cold messages and off-platform payment. Freelancer.com offers a public API with search and bids; only single bids Gigi approves, never bulk.
- **Runs on:** Cloudflare free plan (email Worker, D1, Workers AI free allowance), Knotwork, [[Rouse]] for phone alerts. $0 a month.
- **Changed the same day:** Gigi chose a browser-only version instead. Claude uses Gigi's own signed-in Chrome on the laptop (the Claude extension) to read new jobs, pick the best, draft and type proposals into the form; Gigi presses Submit. No servers or APIs. On Upwork, scanning only while Gigi is at the laptop, or Gigi opens a job and asks for a draft (no bot risk); never press Submit.

## Freelance profiles (2026-11-18)
Gigi set the positioning: an agent developer with long programming experience who can set up and automate any kind of work with agents and AI. All three profiles were rewritten around **agentic engineering** the same day, in Gigi's own signed-in Chrome.
- **Upwork:** new title (AI agent developer, agentic engineering, MCP and automation), new overview, 20 skills. Portfolio still empty.
- **Freelancer.com:** new headline and summary, 5 skills added.
- **Fiverr:** new tagline and About. Gigi asked to delete every old gig (four, confirmed by Gigi) and replace them with three: **Agentic Engineering**, **Website Development**, **MVP Development**. Agentic Engineering is published ($100 / $300 / $700); the other two are being set up.
- **Only real work is cited:** [[Knotwork]], [[Rouse]] and production full-stack work on a live events platform.
- **Gig image rule (Gigi):** the main image of a gig is not a portfolio screenshot. It shows Gigi in the center with several agents (small robots) around, in the look of [[gigiberidze.com]], made with Higgsfield from Gigi's real profile photo. A first version was rejected because the face and hair did not look like Gigi.
- **Hourly rate** is still $15 on Upwork and Freelancer.com; the plan above suggests $30 to $35. Gigi's call.
- The texts live in the project files (`client-strategy/profiles/profile-texts.md`), not in this vault.

## Next
- [x] Profile and gig texts (done 2026-11-18, see Freelance profiles)
- [ ] Gigi: which to prepare next: lead lists (needs a business type for each market) or the site changes ([[Open questions]])
- [ ] Finish the Website Development and MVP Development gigs; add Knotwork and Rouse as portfolio pieces on Upwork
- [ ] Gigi: OK the Freelance Lead Desk plan, and choose for Upwork: Gigi opens jobs and Claude drafts, or Claude scans too while Gigi is at the laptop

## Related
- [[gigiberidze.com]], [[Rouse]], [[Knotwork]], [[About Gigi]]
