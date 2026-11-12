---
type: system
status: live
created: 2026-10-31
updated: 2026-11-12
tags: [system, analytics, cloudflare]
---
# Traffic analytics

**Cloudflare Web Analytics** is on for gigiberidze.com (it turned itself on around 2026-10-28). Cookie-free, free, no code needed.

- Dashboard: Cloudflare > Web Analytics > gigiberidze.com ([[Links]]).
- Worker request metrics: Workers & Pages > gigiberidze > Metrics.

## Readings
| Date | Visits (24h, bots excluded) | Page views | Avg load | Notes |
|---|---|---|---|---|
| 2026-10-31 | 9 | 9 | ~2.6 s | LCP poor on half of loads (up to ~4.2 s), caused by `web-1-cover.webp`, mostly render delay |

How to check: [[Check site traffic]].

## Rouse (rouse.gigiberidze.com)
Rouse is a Worker custom domain in the same zone, so it should show up in the same Web Analytics view: filter by **Host = rouse.gigiberidze.com**. If it doesn't appear, add the hostname as its own site in Web Analytics.

Cloudflare shows visits, not search words. Search words need **Google Search Console** (free): a *Domain* property for gigiberidze.com, verified with a DNS TXT record in Cloudflare, covers every subdomain. Then Performance > Search results, filter Page contains `rouse.`. Not set up yet (2026-11-12).

### Keywords to watch (picked 2026-11-12, volumes not checked yet)
Plain "rouse" is an ordinary English word, so track it only next to other words.

| Group | Keywords |
|---|---|
| Brand | rouse mcp, rouse claude, rouse ai pager, "wake the human" |
| Main need | claude code notification phone, notify me when claude code finishes, claude code push notification, mcp server phone notification, ai agent phone alert |
| Wake-up / call | ai agent call my phone, claude code alarm, mcp phone call |
| Human in the loop | human in the loop mcp, claude code permission prompt phone, approve claude code from phone |
| Channels | claude code telegram notification, ntfy claude code, pushover mcp, claude code hooks notification |
| Category | mcp pager, pager for ai agents, mcp server notifications |

Check volumes in Google Keyword Planner (free with a Google Ads account) or Google Trends; after a few weeks, Search Console shows the real queries.

The landing page's `<title>` is "Rouse · Wake the human" and has no "Claude" or "MCP"; the site has no `robots.txt` or `sitemap.xml` yet (2026-11-12).
