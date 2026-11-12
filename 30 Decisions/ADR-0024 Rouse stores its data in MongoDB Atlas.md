---
type: decision
status: accepted
created: 2026-11-12
updated: 2026-11-12
date: 2026-11-12
tags: [decision, rouse, database]
supersedes: "[[ADR-0018 Rouse is one Worker with D1 and a timer object]]"
superseded-by:
---
# ADR-0024 Rouse stores its data in MongoDB Atlas

## Context
On 2026-11-12, [[Rouse]] accounts ([[ADR-0023 Rouse accounts use email, password and recovery codes]]) were already merged and deployed on D1, waiting only for the `AUTH_PEPPER` secret. Gigi then asked for a MongoDB Atlas project for Rouse with the auth system set up on it. Asked to choose between keeping D1 and moving, Gigi chose **Move to MongoDB Atlas**.

## Options considered
1. **Keep D1.** Already live, no outside account, no connection to hold.
2. **MongoDB Atlas behind a Durable Object hub**, as in [[Knotwork]]. Same database tooling as Knotwork, but a Worker can't afford the connection handshake (30 to 90 ms of CPU against the 10 ms limit), so one Durable Object must hold the connection.

## Decision
Option 2. The setup:
- An Atlas project "Rouse" in the same organization as Knotwork, holding the free M0 cluster `rouse` (AWS Frankfurt) and the database `rouse`.
- One database user, `rouse-worker`, whose only role is readWrite on `rouse`.
- The network access list allows any address, because Workers have no fixed IPs.
- The secrets `MONGODB_URI` and `AUTH_PEPPER` are Worker secrets. Their values are kept in a folder on Gigi's laptop desktop, never in a repo.

It was built in [PR #4](https://github.com/GigiBeridzeAxal/rouse/pull/4):
- One Durable Object, the hub, runs the account routes on its connection.
- It closes the connection after 20 quiet seconds.
- It stops opening connections after 2 hours of connection time per UTC day, and answers 503 until midnight UTC.
- Requests that need no database never reach it. That covers no session cookie, a bad origin and rate limits.

## Consequences
- **Free Durable Object time.** It is shared across the Cloudflare account: 13,000 GB-s a day, and Knotwork's always-on hub uses about 11,000. The daily budget caps Rouse at about 920 GB-s, so Rouse can't stop Knotwork. Someone sending requests all day can use up Rouse's own budget, and then accounts rest until midnight UTC.
- **Speed.** The first account request after a quiet spell waits about a second for the connection.
- **Phase 1 data.** Alerts, agents, devices and settings will be MongoDB collections too, not the SQL tables in the plan. Deleting an account must delete them.
- **Rollback.** Cloudflare can't roll back past the deploy that added the hub.
- **Leftover D1.** The D1 database `rouse` (with the earlier schema, no accounts) stays unbound until Gigi agrees to delete it.
