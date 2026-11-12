---
type: decision
status: superseded
created: 2026-11-10
updated: 2026-11-12
date: 2026-11-10
tags: [decision]
supersedes:
superseded-by: "[[ADR-0024 Rouse stores its data in MongoDB Atlas]]"
---
# ADR-0018 Rouse is one Worker with D1 and a timer object

## Context
[[Rouse]] must cost nothing ([[About Gigi]]), fit the free plan's 10 ms of CPU per request, and fire a step "60 seconds after the last one" on time.

## Options considered
1. MongoDB Atlas behind a Durable Object, as [[Knotwork]] does. Works, but needs an outside account and keeps an object awake to hold the connection.
2. All data inside one Durable Object. Simple, but a waiting Claude would keep the object awake and use up its free running time.
3. D1 for data, one Durable Object used only for alarms, and the Worker asks D1 again while Claude waits.
4. Cron instead of alarms. Free, but once a minute at best.

## Decision
Option 3. `wait_for_reply` holds up to 25 seconds per call and checks D1 every few seconds.

## Consequences
- No outside database account and almost no object running time.
- Waiting costs requests and D1 reads instead; both must be measured in phase 0.
- The zone's one WAF rate rule belongs to Knotwork, so this app rate limits itself.

Related: [[Rouse system plan]], [[ADR-0003 Knotwork runs on the Cloudflare free plan]]
