---
type: system
status: live
created: 2026-10-29
updated: 2026-11-09
tags: [system, cloudflare, account]
---
# Cloudflare

The account that runs everything. **Free plan only** (see [[About Gigi]]).

| What | Where |
|---|---|
| Worker `gigiberidze` (the site) | Workers & Pages > gigiberidze. See [[gigiberidze.com]] |
| Worker `knotwork` (data in [[MongoDB Atlas]]; the old D1 `knotwork` is no longer used once accounts ship) | Workers & Pages > knotwork. See [[Knotwork]] |
| WAF rate-limit rule "Knotwork API" (the free plan's only one) | gigiberidze.com > Security rules. `/api/` on knotwork.gigiberidze.com: 10 requests per 10 s per IP, block 10 s. Added 2026-11-09 |
| DNS for gigiberidze.com | Domain > DNS |
| Email Routing | Domain > Email > Email Routing. See [[Contact email]] |
| Web Analytics | Analytics & Logs > Web Analytics. See [[Traffic analytics]] |

Access: only through Gigi's browser (Claude in Chrome). Cloud sessions have no Cloudflare connector, and the proxy blocks the dashboard. Never change DNS or account settings without Gigi's OK ([[Working agreements]]).
