---
type: decision
status: accepted
created: 2026-11-14
updated: 2026-11-14
date: 2026-11-14
tags: [decision, rouse, mcp, oauth]
supersedes:
superseded-by:
---
# ADR-0027 Claude signs in to Rouse with OAuth and one alert tool

## Context
On 2026-11-14 Gigi asked for the MCP server between Claude and [[Rouse]], and wanted a plan first (https://claude.ai/artifact/M7SkDxo89cgFvjZt7FRmB4, private to Gigi). Rouse has accounts ([[ADR-0023 Rouse accounts use email, password and recovery codes]]) on MongoDB behind a hub Durable Object with 2 hours of connection a day ([[ADR-0024 Rouse stores its data in MongoDB Atlas]]). Claude's custom connectors and Claude Code both sign in to a remote MCP server with OAuth; a Worker request has 10 ms of CPU on the free plan.

## Options considered
1. **One tool with an urgency** (`alert_human` with `info`, `important`, `critical`), Rouse decides how loud. Or **three tools** (notify, alarm, call), the agent decides.
2. **Sign-in:** OAuth 2.1 built into the Worker, or a pasted API key (Claude's connector screen has no field for one), or an outside identity service (a second account system and a paid tier later).
3. **Access keys:** random ones looked up in the database on every request, or signed ones the Worker can check alone.
4. **Waiting for an answer:** hold the hub open, or let the Worker sleep and look every few seconds.

## Decision
- **One tool, `alert_human`, with an urgency.** Gigi chose "Build it as drawn" on 2026-11-14. Rouse owns the ladder, the hourly limits per agent (3 critical, 10 important, 30 in all; past 30, or 100 a day for the account, an alert is refused), mute and duplicates, so a confused agent can't decide to phone at 3 AM on its own. Five more tools read and manage: `wait_for_reply`, `get_alert`, `cancel_alert`, `list_alerts`, `check_availability`.
- **OAuth 2.1 inside the Worker**, with Rouse as its own authorization server: discovery documents, apps register themselves (no secrets; PKCE S256 required), an Allow screen at `/oauth/authorize`, codes that work once for 2 minutes.
- **Registering stores nothing.** The client id is the registration itself (name and return addresses), signed by Rouse. Codes and refresh keys carry a signature too. So the Worker turns made-up requests away alone, and nobody without an account can make the hub spend its database time (found in the review, 2026-11-14).
- **Access keys are signed** (HMAC with a key derived from `AUTH_PEPPER`), last 1 hour, and are checked without the database. Every tool call still checks that the agent exists, so Disconnect works at once. Refresh keys are random, stored hashed, replaced on each use, 90 days.
- **One agent per app and account**, listed on the Agents page, cut off one at a time.
- **`wait_for_reply` sleeps in the Worker** (at most 25 seconds a call): one database look per call, then a peek every 5 seconds that the hub answers from memory, and a second look once a peek says the alert was answered. After 15 minutes an unanswered alert reads as expired, so an agent never waits for hours on a muted night.
- **The ladder's clock is the hub's alarm**, not a second Durable Object.
- **Only the signed-in app answers** (`/app/alerts/<id>`), as [[ADR-0020 Rouse links from outside services cannot answer]] requires.
- The endpoint speaks MCP 2026-07-28 and the earlier revisions back to 2024-11-05.

## Consequences
- The handshake, the tool list and registering never wake the hub. A tool call costs one short hub visit; a 5 minute wait costs about 13.
- The ladder's alarm may run 10 minutes past the hub's daily budget, so a busy day can't stop a ringing alert from climbing.
- Changing `AUTH_PEPPER` would also end every agent's access key (they sign in again with their refresh key; passwords would break first, see [[Deploy Rouse]]).
- An app's name on the Allow screen is its own claim. The screen says "calls itself" and shows where the approval returns.
- Apps identify themselves only by registering. Client ID Metadata Documents (the newer way) are not supported yet; add them if a Claude client stops registering.
- Reaching the phone is one function, `deliver()` in `worker/deliver.ts`, built separately: [[Rouse pairing and calls plan]]. Until it lands an alert shows in the open app and nothing rings.
- How to connect: [[Connect Claude to Rouse]].
