---
type: decision
status: accepted
created: 2026-10-29
updated: 2026-11-09
date: 2026-10-29
tags: [decision]
supersedes:
superseded-by:
---
# ADR-0002 Host the site on Cloudflare Workers with Builds

## Context
The site was first deployed by hand with wrangler from a branch that was never merged. DNS was already on Cloudflare.

## Decision
Keep the site as a Cloudflare Worker serving static assets, merge the deploy config into `main` (PR #2), and connect Workers Builds so every push to `main` deploys and other branches get previews.

## Consequences
- Merging to `main` ships to production.
- Preview builds need the `previews` block in `wrangler.jsonc`.
- Free, no Vercel.

Related: [[gigiberidze.com]], [[Deploy gigiberidze.com]]
