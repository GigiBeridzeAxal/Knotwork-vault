---
type: decision
status: accepted
created: 2026-11-25
updated: 2026-11-25
date: 2026-11-25
tags: [decision, seo, site]
supersedes:
superseded-by:
---
# ADR-0033 Be findable by search and AI assistants with plain facts

## Context
On 2026-11-25 Gigi asked for full SEO and GEO (generative engine optimization): AI assistants and Google should know Gigi and name them when people ask for an agentic engineer, an AI architect or a developer. An audit the same day found [[gigiberidze.com]] readable but nearly invisible: 3 pages, no sitemap, no structured data, no `llms.txt`, and no other site mentioning Gigi.

## Options considered
1. Keyword-heavy pages and bought links or reviews. Fast to make, but search engines and assistants discount them and they would hurt with real clients.
2. State true facts clearly on the site in forms machines read, then get the same facts repeated on profiles, directories and articles, and measure with fixed questions to the assistants.

## Decision
Option 2, in five stages, which Gigi approved on 2026-11-25 (plan: https://claude.ai/artifact/XfkUkmfsM57RH45qQ29eZW). The public role is "Agentic Engineer & AI Architect". Stage 1 (site) is gigiberidze.com PR #13.

## Consequences
- Nobody can promise that an assistant names one person as "the best". Narrow questions (the name, Georgia, MCP pager) are the first target.
- Every claim on the site must be true and visible on the page; structured data only repeats it. No prices, no city, no invented clients or reviews.
- Facts now live in one file (`src/lib/site.ts`) plus two text files that must be kept in step.
- Most of the long-term result depends on mentions outside the site, which need Gigi's time to publish.
