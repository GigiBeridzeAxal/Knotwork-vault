---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision]
supersedes:
superseded-by:
---
# ADR-0001 Use an Obsidian vault as project memory

## Context
Knowledge about the project was spread across Claude thread replies and a small shared memory store. A new session had to rediscover how things are deployed, and Gigi had no single place to read it.

## Decision
Keep one Obsidian vault as the documentation and memory for the whole project. Structure: numbered folders by note type (projects, systems, decisions, runbooks, memory), a Home map of content, frontmatter on every note, and core Bases views instead of community plugins. Agents follow `CLAUDE.md`.

## Consequences
- Every agent reads and updates the vault, so it stays current.
- No community plugins are required; it opens cleanly in any recent Obsidian.
- Synced to the public GitHub repo Knotwork-vault (Gigi chose public on 2026-11-09), so it must never hold secrets or private details.

Related: [[How this vault works]]
