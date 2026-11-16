---
type: project
status: active
created: 2026-11-15
updated: 2026-11-16
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
2. **Fiverr**: three gigs (AI automation, AI customer assistant, custom agent or MCP server), three packages each, replies within an hour. Free to list; Fiverr keeps 20%.
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

- **2026-11-16, lead 1 (local clothing retailer, several shops, sells through Instagram DMs):** researched, first message drafted, not contacted yet. Private brief linked in the project thread "Research Brandhouse for first outreach".

### Playbook: clothing and shoe shops that sell on Instagram
- **Signs to look for:** no website, "order by DM" in the bio, free delivery, many posts and videos, many Google reviews with no owner replies, reviews in several languages (tourist areas).
- **Lead offer:** a DM assistant on Instagram and Facebook (Meta's official messaging API) that answers price, size, stock, delivery and address in the customers' languages and hands the order to staff.
- **Follow-on offers:** comment-to-DM replies, drafted Google review replies that staff approve, a shared product sheet as the bot's memory, an order tracker with delivery updates, sale broadcasts to opted-in buyers.
- **Demo that lands:** a 2 minute video of a test account answering about the shop's own posted items.
- **Guardrail:** the bot never claims an item is original or answers authenticity questions; it passes those to staff.
- **Starting price guess (local):** about $370 to $930 setup plus $55 to $110 a month for the DM assistant; a 2 week Instagram-only pilot first. Not tested.

## Next
- [ ] Gigi: which to prepare first: profile and gig texts, lead lists (needs a business type for each market), or the site changes ([[Open questions]])

## Related
- [[gigiberidze.com]], [[Rouse]], [[Knotwork]], [[About Gigi]]
