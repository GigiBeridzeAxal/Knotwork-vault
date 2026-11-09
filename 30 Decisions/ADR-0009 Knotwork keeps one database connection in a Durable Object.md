---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork, cloudflare]
supersedes:
superseded-by:
---
# ADR-0009 Knotwork keeps one database connection in a Durable Object

Replaces one line of [[ADR-0008 Knotwork has accounts and stores data in MongoDB Atlas]] ("the Worker opens one connection per request"). The rest of ADR-0008 stands.

## Context
The first production deploy of accounts (version `681fc677`, 2026-11-09 19:25 UTC) opened a MongoDB connection for every request. Measured live: about 1.7 s of waiting per request for the connection, and 30 to 90 ms of CPU (cron median 89 ms) against the free plan's 10 ms. Nothing failed in seven minutes, but it was slow and far over the limit, so it was rolled back.

A Worker can't keep a socket between requests. A Durable Object can.

## Options
1. **Keep one connection per request.** Simple, but slow and over the CPU limit on every request.
2. **One Durable Object ("hub") that holds the connection** and runs the API, webhooks and cron tick. Free on the Workers free plan (SQLite-backed class). Chosen.
3. **Go back to D1.** Fast and free, but Gigi asked for MongoDB.

## Decision
The Worker forwards `/api/`, `/hooks/` and the cron tick to one Durable Object, class `Hub` in `worker/hub.ts`, placed in western Europe next to the Atlas cluster (Frankfurt). The hub keeps one connection open (two pooled sockets). If a request fails with a connection error, it starts a fresh connection and closes the old one when the work still using it has finished. The Worker checks the per-IP rate limit before forwarding, and answers 503 when the hub can't be reached.

## Consequences
- Measured over an hour in production (version `b4f019c1`): Worker CPU p99 2 ms for requests and 6 ms for the cron; `/api/overview` about 50 ms in total instead of about 2 s. No errors.
- The cron wakes the hub every minute, so it stays in memory all day. That is about 11,060 GB-s of the free plan's 13,000 GB-s of Durable Object duration a day, and 100,000 requests a day. There is only one hub, so it can't use more duration than that. Check Workers & Pages > Durable Objects after a normal day.
- Everything goes through one object in one region. Visitors far from Europe get a longer round trip.
- `wrangler.jsonc` has the `HUB` binding and a `v1` migration for the class. Cloudflare refuses `wrangler rollback` to a version from before a Durable Object migration, so `90721a08` and `681fc677` can no longer be rolled back to. The way back if the hub is the problem: deploy with `--var HUB_OFF:1`, which runs without it ([[Deploy Knotwork]]).
- Tests run without the binding and open a connection per request.
- Note 2026-11-09 (PR #5, #11, #12): when the hub replaces its connection was narrowed after review. The decision stands; the current rules are in [[Knotwork]] and the repo README.

Related: [[Knotwork]], [[MongoDB Atlas]], [[Cloudflare]], [[ADR-0003 Knotwork runs on the Cloudflare free plan]], [[Deploy Knotwork]]
