---
type: project
status: proposed
created: 2026-11-14
updated: 2026-11-14
tags: [project, plan, rouse, push, calls]
---
# Rouse pairing and calls plan

How the [[Rouse]] home-screen app on Gigi's iPhone becomes a device the account can wake: real notifications, then calls. Gigi asked on 2026-11-14 ("we need to pair it to my device and account should have my device notifications + call as well"), then asked for a plan before any build. Reading version: https://claude.ai/artifact/FwG4b82Hos1vwqn9gHhAhp (private to Gigi; source `rouse/rouse-pairing-plan.html` in the project files). **Nothing is built yet; waiting on Gigi's go-ahead and choice of call route.**

## Pairing
- An iPhone home-screen web app keeps its own sign-in, separate from Safari. A QR code scanned with the camera opens Safari, so QR pairing would pair the wrong place. This replaces the "QR plus 6-digit code" idea in [[Rouse dashboard plan]] for the web app.
- Pairing is: open Rouse from the home screen, sign in, tap "Turn on notifications on this iPhone" (iOS only asks after a tap), Allow. The push subscription is stored under the account in a new `devices` collection. Then "Ring this iPhone" sends a real push from the server.
- Devices can be renamed, tested, removed; at most 10 per account; a failing push marks the row and Home.

## Notifications (free)
- Web Push sent by Rouse itself (VAPID signing and payload encryption with WebCrypto, inside the hub). Needs iOS 16.4 or later and the app on the home screen. Private key is a Worker secret `VAPID_PRIVATE_KEY`; the public key is not secret.
- Payload also carries the declarative form (iOS 18.4 and later), so a push shows even if the service worker fails.
- A service worker is added to receive pushes and open the answer screen.
- Limits: obeys the silent switch and Focus; no critical alerts without a native app and the paid Apple program. "Alarm" on iPhone is the same push repeated every 20 seconds for a minute.

## Calls
All routes behind one adapter.
| Route | Cost | Notes |
|---|---|---|
| Telegram call through CallMeBot | Free | Rings 30 seconds. Shared outside service, best effort. Needs Telegram on the phone |
| Twilio phone call | Paid per started minute plus a monthly number fee | Real call. With the number saved as a contact with Emergency Bypass it rings through silent mode and Focus. Off by default, monthly cap (default 5 USD) |
| None | Free | Push only |

- Checked 2026-11-14 on Twilio's price page: a call to Gigi's mobile costs roughly half a dollar a minute, not "a few cents" (that is the US price). Unanswered calls are not billed. Number from 1.15 USD a month. Exact figures are in the private plan.
- Twilio's trial: no card, 75 voice minutes, only to verified numbers in the sign-up country.
- On a call the voice says a generic sentence only. Press 1 stops the ringing, 2 snoozes 10 minutes; neither answers the alert ([[ADR-0020 Rouse links from outside services cannot answer]]).
- Twilio needs the account's phone number, proven by a call that reads a 6-digit code.

## Entry point for the MCP thread
`raiseAlert(account, {title, message, urgency, options, agent})`, `getAlert`, `cancelAlert`, `listAlerts` as plain functions; the dashboard's test ring uses the same path.

## Ladder timer
The existing hub Durable Object sets an alarm for the next step. About 2.5 of its 120 daily connection minutes per critical alert ([[ADR-0024 Rouse stores its data in MongoDB Atlas]]).

## Build order
1. Pair and push (Gigi: one double-click on the PC to set the push secret, four taps on the iPhone).
2. Alerts and answers.
3. Ladder (timer, repeated pushes, stop on answer).
4. Calls (the chosen route, the other ready behind the switch).

One pull request per step; nothing goes live without Gigi's OK.

Related: [[Rouse system plan]], [[Rouse dashboard plan]], [[ADR-0019 Rouse uses free channels first]]
