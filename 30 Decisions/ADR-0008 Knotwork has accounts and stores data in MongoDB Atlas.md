---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork]
supersedes: "[[ADR-0004 Knotwork is public with per-browser workspaces]]"
superseded-by:
---
# ADR-0008 Knotwork has accounts and stores data in MongoDB Atlas

## Context
Gigi asked on 2026-11-09 for a fully working sign-in without any email sending: create an account, a demo account, and a sidebar with a "Personal" workspace and a + box for workflows. They chose MongoDB for the data, on a new free Atlas cluster.

## Decision
- Accounts with email and password, no email verification or reset mail. Passwords are hashed with PBKDF2 plus a pepper kept in a Wrangler secret. Sessions are a hashed token in an HttpOnly `__Host-` cookie.
- A shared demo account anyone can open with one click, reset every day at 03:00 UTC.
- Every account gets a Personal workspace (it can't be deleted) and up to 5 more. All data is scoped to workspaces the caller owns.
- Data moves from D1 to a free MongoDB Atlas M0 cluster. The Worker opens one connection per request.
- To stay on free plans for everyone: hourly run and byte budgets per account and overall, a pending-run cap, a cron that lets accounts take turns, signed webhook URLs, per-IP and per-network rate limits, one Cloudflare WAF rate-limit rule on `/api/`, and a storage guard that keeps the 512 MB cluster from filling up.

## Consequences
- Workspaces follow the account, not the browser.
- Anyone can still try it instantly through the demo.
- Deploys need two Worker secrets (`MONGODB_URI`, `AUTH_PEPPER`) and `npm run db:setup`. See [[Deploy Knotwork]].
- The free Worker allows about 10 ms of CPU per request, so password hashing uses fewer rounds than usual (the pepper makes up for it), and the CPU per request still has to be measured before deploying.

Related: [[Knotwork]], [[MongoDB Atlas]], [[ADR-0003 Knotwork runs on the Cloudflare free plan]], [[ADR-0009 Knotwork keeps one database connection in a Durable Object]] (replaces "one connection per request")
