---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork, security, api]
supersedes:
superseded-by:
---
# ADR-0014 Knotwork API keys work in one workspace and never outrank their maker

## Context
Phase 5 adds a public API so scripts can read and run workflows. A key is a long-lived secret that may sit in a script for months.

## Options considered
1. Account-wide keys with the account's full rights.
2. Keys tied to one workspace, read-only or read and write, limited to workflow and run routes.

## Decision
Option 2.
- A key works in one workspace and reaches only workflows, runs and the overview. It can't touch accounts, members, invite links or other keys.
- Its rights are the lower of its own access and its maker's role right now: the role is read on every request, and a removed member's keys are deleted.
- A key is shown once and stored only as a hash. It carries a signature, so a made-up key is refused before any database lookup.
- 10 keys per account. Changing or recovering the password ends them all. The demo account can't make keys.
- The API is documented in `docs/api.md` in the repo, linked from Settings.

## Consequences
- A leaked key exposes one workspace's workflows and runs, not the account.
- Scripts that span workspaces need one key each.
- After a password change every script needs a new key.
