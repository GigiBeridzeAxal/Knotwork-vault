---
type: decision
status: proposed
created: 2026-11-10
updated: 2026-11-10
date: 2026-11-10
tags: [decision, security]
supersedes:
superseded-by:
---
# ADR-0020 Rouse links from outside services cannot answer

## Context
An answer can approve real work, for example a database migration. ntfy's public server and the call service see whatever is sent through them, and an ntfy topic can be read by anyone who learns its name. The first draft of the plan put a one-time answer link in those messages; the self-review on 2026-11-10 flagged that whoever sees the link could approve in Gigi's place.

## Decision
Messages through outside services carry a generic sentence and a link that only opens the alert. Answering needs the signed-in web app on Gigi's phone, or a button press in Gigi's own Telegram bot chat (checked against the stored chat and the hook's shared secret).

## Consequences
- A leaked topic or link shows nothing private and approves nothing.
- One more tap when coming from ntfy: the link opens the app, which is already signed in.
- Pushover's "acknowledge" can stop a ladder but can never count as an answer.

Related: [[Rouse system plan]]
