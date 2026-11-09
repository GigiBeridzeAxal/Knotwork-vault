---
type: decision
status: accepted
created: 2026-10-30
updated: 2026-11-09
date: 2026-10-30
tags: [decision]
supersedes:
superseded-by:
---
# ADR-0006 Contact email through Cloudflare Email Routing

## Context
The site needed a contact address without showing Gigi's personal Gmail.

## Decision
Use `hello@gigiberidze.com` with Cloudflare Email Routing forwarding to Gmail. Mailto link only, no contact form.

## Consequences
- Free, no mail server.
- Receive only; sending as hello@ would need another service.

Related: [[Contact email]]
