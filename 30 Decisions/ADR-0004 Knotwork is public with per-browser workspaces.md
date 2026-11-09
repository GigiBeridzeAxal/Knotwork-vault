---
type: decision
status: superseded
created: 2026-11-07
updated: 2026-11-09
date: 2026-11-07
tags: [decision]
supersedes:
superseded-by: "[[ADR-0008 Knotwork has accounts and stores data in MongoDB Atlas]]"
---
# ADR-0004 Knotwork is public with per-browser workspaces

## Context
v1 had an admin token. Gigi didn't want the demo locked behind a sign-in.

## Decision
Remove the sign-in and delete the `ADMIN_TOKEN` secret. Each browser gets its own private workspace id, sent as `x-knotwork-workspace`. Limits in `shared/limits.ts`: 10 workflows and 60 runs per hour per workspace.

## Consequences
- Anyone can try it instantly.
- Workspaces are tied to the browser; clearing storage loses them.
- Abuse is bounded by the limits, not by identity.

Related: [[Knotwork]]
