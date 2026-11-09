---
type: system
status: live
created: 2026-11-09
updated: 2026-11-09
tags: [system, database, knotwork]
---
# MongoDB Atlas

The database behind [[Knotwork]] since 2026-11-09. See [[ADR-0008 Knotwork has accounts and stores data in MongoDB Atlas]].

| What | Value or where |
|---|---|
| Plan | Free M0 cluster (512 MB, data plus indexes) |
| Cluster | `knotwork`, region Frankfurt, in its own Atlas project "Knotwork" |
| Database | `knotwork` (collections `users`, `sessions`, `workspaces`, `workflows`, `runs`, `versions`, `counters`; from Knotwork PR #8 also `members`, `invites`, `apiKeys`) |
| Connection string | Worker secret `MONGODB_URI`; a copy in the gitignored `Downloads\knotwork-secrets\` folder on Gigi's PC. Never in a repo or this vault. |
| Password pepper | Worker secret `AUTH_PEPPER`, same folder. The Worker and `db:setup` must use the same value. |
| Network access | Allowed from anywhere (Workers have no fixed IPs) |
| Indexes | Created by `npm run db:setup` (also checked by the cron once an hour) |

What is stored for access (from PR #8): invite links and API keys only as SHA-256 hashes, recovery codes only as keyed hashes (keyed with `AUTH_PEPPER`) on the user document. A copy of the database holds no working link, key or code. Invite links delete themselves when they expire (TTL index).

Access: through Gigi's browser (Claude in Chrome in Edge). The Atlas project id is deliberately not written here.

> [!note] The database user has the `readWriteAnyDatabase` role. `readWrite` on the `knotwork` database alone is enough; narrowing it is an open question.

Related: [[Cloudflare]], [[Deploy Knotwork]]
