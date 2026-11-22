---
type: decision
status: proposed
created: 2026-11-22
updated: 2026-11-22
date: 2026-11-22
tags: [decision, email, rouse, cloudflare]
supersedes:
superseded-by:
---
# ADR-0032 hello@ mail goes through the Rouse Worker

## Context
On 2026-11-22 Gigi asked for a Claude Haiku check of hello@gigiberidze.com every 5 minutes, with a Rouse ping to the phone when mail comes in. Scheduled Claude tasks normally run at most hourly. The Gmail inbox that hello@ forwards to can only be read through Chrome on Gigi's laptop. A test mail on 2026-11-18 also landed in Gmail Spam.

## Options considered
1. A scheduled Haiku session polling Gmail. At best hourly, the laptop has to stay on, and it uses Claude usage.
2. Point the hello@ Email Routing rule at the Rouse Worker. Its `email()` handler forwards the mail to Gmail and pushes the sender and subject to the paired iPhone.

## Decision
Option 2, which Gigi chose on 2026-11-22. Forwarding happens first. If forwarding fails, the mail is refused, never dropped. Pings are capped at 10 a minute. The mail body is not read or stored. Built in rouse PR #14.

## Consequences
- It's instant and free, and it also flags mail that Gmail puts in Spam.
- The hello@ rule now depends on the Rouse Worker. To roll back, set the rule back to "Send to an email" in Email Routing.
- It needs two Worker secrets, `MAIL_FORWARD_TO` and `MAIL_OWNER`. Their values are stored in Cloudflare only.
- Next step, waiting for Gigi's OK: a reply-drafting assistant (Workers AI free tier, Send/Edit/Skip in Rouse). Plan: https://claude.ai/artifact/UVdHFLGYZWYNt4UwQirPCi
