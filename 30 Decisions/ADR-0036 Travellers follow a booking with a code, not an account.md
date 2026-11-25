---
type: decision
status: accepted
created: 2026-11-25
updated: 2026-11-25
date: 2026-11-25
tags: [decision, business, clients, cloudflare]
supersedes:
superseded-by:
---
# ADR-0036 Travellers follow a booking with a code, not an account

## Context
On 2026-11-25 Gigi asked to take the agency's phone number off the lead 2 demo site ([[Client acquisition]]) and put a "My tickets" system in its place. Gigi chose the meaning on a card: a page for travellers, not a support inbox. A traveller books on the tour page, pays a deposit, and then follows the booking alone: status, what is paid and what is left, a question to the manager, cancel. The demo must cost nothing to run, use no paid service (no SMS, no mail sending), and ask only for made-up details.

## Options considered
1. Accounts with email and password. Familiar, but a traveller who books once a year will not keep a password, and password recovery needs mail sending.
2. Sign-in with a code sent by SMS. Easy for the traveller, but every message costs money.
3. No accounts. The booking gets a code. The device that booked remembers the ticket. On another device the code plus the last 4 digits of the phone number open it.

For storage: a D1 database, or one SQLite Durable Object.

## Decision
- Option 3. The booking code is printed on a boarding pass page; a yellow "My tickets" button with a count replaces the phone number on every page.
- The device keeps a ticket token (a keyed hash of the code made by the Worker). The page never stores the phone number, and the API never returns it; only the staff panel shows it.
- One Worker with one SQLite Durable Object. Every store method is synchronous, so each call is one atomic step: the last seats cannot be sold twice, and seats go back exactly once on cancel.
- The deposit is a TEST bank page with Approve and Decline only, as in [[ADR-0030 Lead demos are one Cloudflare Worker with a rule-based assistant]].
- Staff confirm bookings and answer questions in a server-rendered panel with no scripts.

## Consequences
- Four digits are weak on their own, so the finder counts wrong tries: per booking code and per visitor. A locked code keeps even its owner out of the finder for up to an hour; the device that booked is not affected.
- A limit must never be usable against other people. A shared cap on wrong finder tries was removed after review, because a few dozen addresses could lock the finder for everyone. Unknown codes are answered without writing anything.
- Limit counters are kept in 5-minute buckets, one row per key and bucket, to save the free plan's row writes.
- In the demo anyone can fill the seats of the one bookable tour, and the staff passcode is public. The panel's reset puts the seats back and the nightly reset clears everything. Before a link goes to many people, a rate-limiting rule for the zone is worth setting in the Cloudflare dashboard (it is not in the repo).
- A real site needs a private passcode, its own site secret, and a real bank adapter. None of that is built.
- The wording on the pages is Georgian and needs Gigi's proofread.
