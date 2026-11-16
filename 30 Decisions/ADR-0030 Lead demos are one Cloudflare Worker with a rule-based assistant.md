---
type: decision
status: accepted
created: 2026-11-17
updated: 2026-11-17
date: 2026-11-17
tags: [decision, business, clients, cloudflare]
supersedes:
superseded-by:
---
# ADR-0030 Lead demos are one Cloudflare Worker with a rule-based assistant

## Context
For the first local lead ([[Client acquisition]]) Gigi asked on 2026-11-17 for a working website and "high level system" to show the business, not only a message. It must cost nothing to run, must not use paid AI credits, and must never claim that an item is original.

## Options considered
1. Reuse an older Vue, Express and MongoDB store Gigi made for the same kind of shop. Already has pages, but needs a server and a database host, and its code holds old settings.
2. One Cloudflare Worker with a D1 database: pages rendered on the server, no framework, tables and sample data created on first run.
3. For the assistant: a free AI model first, or fixed rules that answer from the database.

## Decision
- Option 2, in a new private repo. The older repo stays untouched (Gigi's choice).
- The assistant is rule-based for now: it answers price, size, stock, delivery, payment, exchange and address from the database and passes everything else to staff. The free AI model could not be tested from a cloud session, and wrong answers about stock or originality would cost more than a narrow assistant.
- The demo keeps a "demo, not the official site" notice on every page and stays hidden from search engines.

## Consequences
- Runs on the free plan. Limits per visitor and a 30 second in-memory item list protect the daily database quota.
- Stock is taken when staff confirm an order, not when the shopper sends it.
- The assistant must not be called "AI" in a pitch until a model is tested on real questions in the shop's language.
- A demo passcode printed on the sign-in page lets anyone change the demo; set a private passcode before sending a link.
- The same repo can be copied for the next shop of this kind (playbook in [[Client acquisition]]).
