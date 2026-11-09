---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork, security]
supersedes:
superseded-by:
---
# ADR-0011 Knotwork ready-made steps call only their own service

## Context
Phase 4 of the [[Knotwork system plan]] adds ready-made Slack, Discord, Telegram and GitHub steps. Their credentials (a webhook URL or a token) are the whole secret, and Telegram even puts the token in the URL path. Workflows also pass outside text (webhook bodies) into messages, so anyone who can trigger a workflow controls part of what gets posted.

## Options considered
1. Build them as presets of the generic HTTP step (any URL, redirects followed, messages show the path).
2. Separate step types that each build their own request to a fixed host, sharing the HTTP step's guards.

## Decision
Option 2. Each service is one settings file (`shared/connectors/`) and one sending file (`worker/connectors/`). A ready-made step:
- calls only its service's host over https (`hooks.slack.com`, `discord.com/api/webhooks/`, `api.telegram.org`, `api.github.com`) and follows no redirects;
- never puts a URL path or token in a message, and masks credentials if an error repeats them (on top of the engine's secret redaction from phase 2);
- turns off mass pings from template text: Discord allows user mentions only; Slack turns `@channel`, `@here` and group mentions into plain text unless the step's "Allow mentions" box is ticked;
- takes credentials as template fields that default to `{{ secrets.NAME }}`.
The shared demo account can still only call its host list, so of the four only GitHub "read a repository" runs there, and the demo isn't offered the example that needs Discord.

## Consequences
- A webhook URL saved for Discord can't be pointed at another server, and a redirect can't carry it away.
- Each new service is a small, reviewable pair of files plus a form, but needs a code change (no user-defined connectors).
- Default retries (2) can post twice if a service times out after accepting a message; users can set retries in the form.
