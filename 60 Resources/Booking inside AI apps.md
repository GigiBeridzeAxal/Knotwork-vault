---
type: resource
status: active
created: 2026-11-25
updated: 2026-11-25
tags: [mcp, geo, commerce, research]
---
# Booking inside AI apps

What a small business (first case: lead 2, a travel agency selling group tours) can offer inside ChatGPT, Claude and Gemini, checked 2026-11-25. Re-check before promising anything; these products change monthly.

**Verdict:** build one MCP server and pair it with GEO on the real site. Finding tours, checking seats and holding a booking can happen in the chat. Paying cannot, for a tour agency outside the US: the last step is a link to the business's own payment page.

| Route | Today | User must | Payment | Listing |
|---|---|---|---|---|
| Claude connector (MCP, with MCP Apps cards) | works on web, desktop, phone | add by URL (paid plans) or pick from directory | link out | paid account submits; automatic scan, sometimes human review; OAuth, tool annotations, privacy policy, test account |
| ChatGPT app / plugin (Apps SDK = MCP + UI) | works | developer mode (web, demos only) or directory | commerce only for physical goods via own-domain checkout; tours = link out | verified owner, privacy/support/terms URLs, demo login without SMS, 5+3 test cases, video, no demo apps |
| Gemini custom app (MCP URL) | US personal accounts only, text only | add on gemini.google.com | none documented | no public directory |
| ChatGPT Instant Checkout (ACP, Stripe) | deprioritized March 2026, partners only | - | - | - |
| Google UCP / AP2 | shopping; lodging and food on waitlist; no tours; US then CA, AU, UK | - | Google Pay | waitlist + Merchant Center |
| GEO / schema.org | works, reaches everyone | nothing | on the site | none |

Order of work for one business: GEO (1-2 days) → MCP server on the same Cloudflare Worker as the booking system (3-5 days, free plan) → Claude directory, then ChatGPT directory once the business owns the real site. No publishing fee found for either directory.

Not settled: which ChatGPT plans have developer mode; Gemini facts are from third-party guides (Oct 2026); Claude Free vs connectors wording conflicts between the FAQ and the Jan 2026 blog.

Sources: OpenAI plugin submission guidelines (developers.openai.com/apps-sdk/app-submission-guidelines), Claude connector submission (claude.com/docs/connectors/building/submission), Claude connectors FAQ, Google UCP (developers.google.com/universal-commerce-protocol), Connector Scout guide to Gemini custom apps. Full comparison is a private page linked from the project thread.
