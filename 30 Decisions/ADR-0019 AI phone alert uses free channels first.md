---
type: decision
status: proposed
created: 2026-11-10
updated: 2026-11-10
date: 2026-11-10
tags: [decision]
supersedes:
superseded-by:
---
# ADR-0019 AI phone alert uses free channels first

## Context
Gigi asked for calls, texts and loud messages. Real phone calls and SMS cost money everywhere; Twilio's trial only reaches verified numbers in the sign-up country and cannot send custom SMS text. Everything must run for free unless Gigi decides otherwise.

## Options considered
1. Twilio for calls and SMS from the start. Closest to the words of the request, paid per use.
2. Pushover for everything. 4.99 USD once per phone type, breaks through silent mode on iPhone and Android.
3. Free ladder: own web push, ntfy urgent, a Telegram bot message and a Telegram call through CallMeBot. Paid channels as optional adapters with the user's own keys.

## Decision
Option 3, proposed. Every channel is an adapter behind one interface, so Pushover and Twilio can be added in phase 5 without touching the rest. Paid channels stay off until Gigi turns them on, with a monthly cap.

## Consequences
- 0 USD to run. Strongest on Android.
- An iPhone on silent is not woken by the free channels; setup must say so.
- "Text" means a push or a Telegram message, and "call" means a Telegram call, until Gigi approves a paid channel.
- CallMeBot is a shared outside service: best effort, never the only loud step, and it only ever gets a generic sentence.

Related: [[AI phone alert system plan]]
