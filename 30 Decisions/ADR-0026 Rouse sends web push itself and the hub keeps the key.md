---
type: decision
status: accepted
created: 2026-11-14
updated: 2026-11-14
date: 2026-11-14
tags: [decision, rouse, push, security]
supersedes:
superseded-by:
---
# ADR-0026 Rouse sends web push itself and the hub keeps the key

## Context
Gigi added Rouse to the iPhone home screen and asked to pair it with the account so the account can notify the phone (2026-11-14). Gigi stayed out of the paid Apple Developer Program ([[ADR-0025 Rouse for iPhone is a Capacitor shell around the live site]]), so the only free route to an iPhone is Web Push for a home-screen web app (iOS 16.4 or later). Web Push needs a signing key pair (VAPID). Earlier secrets for Rouse had to be set by Gigi by hand, because agents may not type secrets into a store, and that cost Gigi time and patience ([[Deploy Rouse]]).

## Options considered
1. A push company (OneSignal, Firebase). Another account, another party that sees who is woken and when.
2. An npm web-push library. Built for Node; needs shims on Workers.
3. Rouse's own sender with WebCrypto (payload encryption per RFC 8291, signed request per RFC 8292), about 200 lines.

For the key: (a) a Worker secret Gigi sets, (b) made by the Worker and stored in MongoDB, (c) made by the hub Durable Object on first use and kept in its storage, sealed with a key derived from `AUTH_PEPPER`.

## Decision
Option 3 with key option (c). An optional `VAPID_KEY` secret overrides the stored pair. Pairing happens inside the home-screen app (sign in, one tap, Allow), because that app has its own sign-in apart from Safari's, so a QR code scanned by the camera would pair the wrong place.

## Consequences
- No new service, dependency, cost or setup step. The push service (Apple's for an iPhone) carries text it can't read.
- A copy of the hub's storage alone doesn't give the key; it also needs the pepper.
- If the hub's storage or the pepper is ever lost, every device must pair again (one tap each). The pepper was already "never change".
- A subscription may only point at Apple's, Google's, Mozilla's or Microsoft's push service, so a made-up one can't aim the Worker elsewhere.
- A device belongs to the session that paired it: signing out unpairs it.
- An iPhone web app can't play a louder sound or ring through the silent switch or a Focus. Only a native app with the paid Apple account, or a phone call, can.

Related: [[Rouse pairing and calls plan]], [[Rouse]], [[ADR-0019 Rouse uses free channels first]]
