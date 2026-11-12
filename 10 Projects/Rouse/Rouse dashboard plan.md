---
type: project
status: active
created: 2026-11-13
updated: 2026-11-13
tags: [project, plan, rouse, design]
---
# Rouse dashboard plan

What the signed-in [[Rouse]] dashboard should hold. Asked for by Gigi on 2026-11-13 ("dashboard artifact plan what we need to have in dashboard"). Read as: the page people land on after signing in at rouse.gigiberidze.com, also wrapped by the coming iOS app. Built on 2026-11-13 as a sidebar dashboard (Gigi asked for a side panel) in [PR #7](https://github.com/GigiBeridzeAxal/rouse/pull/7), not merged yet; see Built below. Reading version with wireframes: https://claude.ai/artifact/2Ac11mUhWinWV4qcgdreuL (private to Gigi).

## The job
Answer two questions first: *can Rouse wake me right now?* and *does anything need me?* The dashboard becomes the signed-in home at `/app`; today's Setup page folds into it as a checklist until setup is done. Account stays as built, under Settings.

## Parts
| # | Part | Shows and does | When |
|---|---|---|---|
| 1 | Status line | One sentence ("Rouse can wake you", "can't reach a phone yet", "Muted until 08:00"), phone last seen, agents connected, quiet hours; **Ring my phone** test; **Mute** (1 hour, until morning, off) | MVP |
| 2 | Needs you | Open alerts: title, message, urgency, agent, ladder bars with next step and countdown; answer with the agent's buttons, a text reply, or stop ringing. Only the signed-in app answers ([[ADR-0020 Rouse links from outside services cannot answer]]) | MVP |
| 3 | Devices | Phones and browsers that can be woken: kind, last seen, push ok; add by QR plus 6-digit code (5 minutes) from the iOS app; test, rename, remove; warning after 7 days unseen or a failed push | MVP |
| 4 | Agents | Each connected agent: label, last used, alerts this hour against its budget; connect instructions; revoke one | MVP |
| 5 | Recent alerts | Last 20 with outcome, answer, time to answer; open one for its step log (which channel fired, delivered or not) | MVP |
| 6 | Setup checklist | Account, add a phone, connect Claude, ring once; replaces the status line until the first answered test | MVP |
| 7 | Channels | ntfy alarm, Telegram bot, Telegram call; connect, test, on/off, role; paid ones only if switched on | Phase 2 |
| 8 | Rules | Quiet hours with time zone, ladder per urgency edited as bars, hourly budgets | Phase 3 |
| 9 | Usage | Alerts a month, answer rate, median time to answer; owner-only hub database time | Later |

States of the top of the page: new (checklist), ready, ringing (alert takes the top), muted, broken (names the fix).

## Data (MongoDB, database `rouse`)
`users` and `sessions` exist. New, all keyed by `userId`:
- `devices`: name, kind (ios, web), push target, app version, lastSeenAt, lastPushOk, lastPushError.
- `pairings`: hash of the code, expiresAt (TTL index, 5 minutes), tries left.
- `agents`: label, hash of the token, createdAt, lastUsedAt, alerts this hour, revokedAt.
- `alerts`: agentId, title, message, urgency, options, status (ringing, answered, expired, cancelled, quiet), steps (kind, channel, dueAt, firedAt, result), answer (value, at, deviceId), createdAt.
- `settings`: mutedUntil, criticalBreaksMute, quiet hours, ladders, budgets, channels.
Push signing keys and bot tokens stay in Worker secrets.

## API
MVP: `GET /api/dashboard` (everything for the home in one round trip), `POST /api/alerts/test`, `POST /api/alerts/:id/answer`, `POST /api/alerts/:id/stop`, `GET /api/alerts?before=`, `POST /api/devices/pairing`, `POST /api/devices`, `PATCH`/`DELETE /api/devices/:id` and `POST /api/devices/:id/test`, `GET`/`DELETE /api/agents/:id`, `PUT /api/settings/mute`. Next: `PUT /api/settings`. All behind the session cookie and the hub.

## Free plan rules
- The home loads from one call, so one hub request and one database round trip.
- No endless polling: the hub closes the database after 20 idle seconds and has 2 hours of connection a day ([[ADR-0024 Rouse stores its data in MongoDB Atlas]]). MVP refreshes on tab focus, and every 15 seconds only while an alert rings and the tab is visible.
- Live updates later through a hibernating WebSocket on the timer object.
- Requests stay under 10 ms CPU; lists page by 20.

## iOS app
Wraps the same React pages. Opens on the answer screen while an alert rings. Pairs by QR from a signed-in laptop (email and password also work), with its own device session. To check before building: Apple's push service requires HTTP/2, so whether the Worker can send to it directly needs a test. TestFlight and Apple push need the paid Apple Developer Program.

## Build order
1. Home shell, navigation, `/api/dashboard`, checklist moved from Setup.
2. Devices and pairing (browser push, then the iOS app).
3. Agents, with phase 1's MCP sign-in.
4. Alerts: ringing card, phone answer screen, history with step log, Ring my phone.
5. Mute.

## Built (2026-11-13, PR #7)
- Sidebar: status card, Home, Alerts, Devices, Agents; Settings group with "Alerts and mute" and Account; a quick mute button; email and sign out. A drawer on phones.
- Routes: `/app`, `/app/alerts`, `/app/devices`, `/app/agents`, `/app/settings`, `/account`; `/setup` opens Home.
- Working now: `GET /api/dashboard`, mute (`PUT /api/settings/mute`, at most 24 hours, `settings` collection, deleted with the account).
- Empty until phase 1: devices, agents, alerts (marked "Phase 1" on the pages).
- Self-review APPROVE: `rouse/review-rouse-dashboard-2026-11-13.md`; screenshots `rouse/screens/dashboard-*.png` in the project files.

Related: [[Rouse system plan]], [[ADR-0023 Rouse accounts use email, password and recovery codes]]
