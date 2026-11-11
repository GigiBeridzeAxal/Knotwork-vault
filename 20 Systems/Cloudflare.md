---
type: system
status: live
created: 2026-10-29
updated: 2026-11-12
tags: [system, cloudflare, account]
---
# Cloudflare

The account that runs everything. **Free plan only** (see [[About Gigi]]).

| What | Where |
|---|---|
| Worker `gigiberidze` (the site) | Workers & Pages > gigiberidze. See [[gigiberidze.com]] |
| Worker `knotwork` (data in [[MongoDB Atlas]]; the old D1 `knotwork` is no longer used since accounts went live 2026-11-09) | Workers & Pages > knotwork. See [[Knotwork]] |
| Durable Object class `Hub` in Worker `knotwork` (one object, western Europe; holds the database connection) | Workers & Pages > Durable Objects shows requests and duration. See [[ADR-0009 Knotwork keeps one database connection in a Durable Object]]. Added 2026-11-09 |
| WAF rate-limit rule "Knotwork API" (the free plan's only one) | gigiberidze.com > Security rules. `/api/` on knotwork.gigiberidze.com: 10 requests per 10 s per IP, block 10 s. Added 2026-11-09. The dashboard paces itself to stay under it, so change `BUDGET` in the repo's `src/pace.ts` whenever these numbers change ([[ADR-0017 Knotwork dashboard paces its own requests]]) |
| Worker `rouse` (custom domain rouse.gigiberidze.com, Workers Builds from the private repo) | Workers & Pages > rouse. See [[Rouse]] and [[Deploy Rouse]]. Live since 2026-11-11 |
| D1 database `rouse` (accounts, sessions, recovery codes; alerts from phase 1) | Storage & Databases > D1 > rouse. Created 2026-11-11, empty until accounts go live. Its id is in the repo's `wrangler.jsonc`, never here |
| Worker secret `AUTH_PEPPER` on `rouse` (mixed into every password and recovery-code hash) | Workers & Pages > rouse > Settings > Variables and Secrets. Not set yet; set once, never changed ([[Deploy Rouse]]) |
| DNS for gigiberidze.com | Domain > DNS |
| Email Routing | Domain > Email > Email Routing. See [[Contact email]] |
| Web Analytics | Analytics & Logs > Web Analytics. See [[Traffic analytics]] |

Access: through Gigi's browser (Claude in Chrome); the proxy blocks the dashboard from cloud sessions. Some cloud sessions have a Cloudflare connector that can list and create D1 databases and search the docs, but its D1 query call answered 403 (2026-11-12). Never change DNS or account settings without Gigi's OK ([[Working agreements]]).
