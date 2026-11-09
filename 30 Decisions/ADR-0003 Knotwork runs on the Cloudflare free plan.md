---
type: decision
status: accepted
created: 2026-11-07
updated: 2026-11-09
date: 2026-11-07
tags: [decision]
supersedes:
superseded-by:
---
# ADR-0003 Knotwork runs on the Cloudflare free plan

## Context
Gigi wants portfolio projects that are real platforms, not toy apps, but they must cost nothing: no funds and no paid AI credits.

## Decision
Build Knotwork on Cloudflare Workers, D1 and Cron Triggers within free limits. Any AI step would use a local model (Ollama), never a paid API.

## Consequences
- Hard per-workspace limits keep usage inside the free tier.
- No features that depend on paid LLM APIs or paid hosting.

Related: [[Knotwork]]
