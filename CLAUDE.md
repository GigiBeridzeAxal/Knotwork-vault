---
type: meta
created: 2026-11-09
updated: 2026-11-09
---
# Instructions for AI agents

This file is for Claude (or any AI coding agent) that opens this vault. Read it first. Humans: see [[How this vault works]].

## What this vault is
The long-term memory and documentation for Gigi's portfolio project (gigiberidze.com and its sub-projects). Treat it as the source of truth for *why* and *how*; the code repos are the source of truth for *what*.

## Before you start work
1. Read [[Home]], then [[About Gigi]] and [[Working agreements]].
2. Open the project or system note for the area you're touching, and its runbooks and decisions (linked at the bottom of each note).
3. Check [[Open questions]] for anything already pending.

## While and after you work
- **New durable fact** (a URL, an id, a path, how something is configured): update the matching system or project note. Don't create a duplicate note; search first.
- **Choice between options** that someone could later ask "why?" about: add a decision in `30 Decisions/` from the ADR template. Never rewrite an accepted decision; write a new one with `supersedes: [[ADR-xxxx ...]]` and set the old one's status to `superseded`.
- **Steps you had to work out**: add or update a runbook in `40 Runbooks/`.
- **Something happened** (deploy, merge, setting changed): add one dated line to [[Changelog]].
- **Preference or rule from Gigi**: update [[About Gigi]] or [[Working agreements]], with the reason.
- Always bump `updated:` in the frontmatter of notes you change.

## This vault is public
It lives in the public repo https://github.com/GigiBeridzeAxal/Knotwork-vault. Anyone can read it.
- Never write secrets, tokens, passwords, API keys, account ids, personal email addresses, phone numbers, home address or exact location, or machine names.
- Write *where* something sensitive lives, never its value.
- If you're not sure something is safe to publish, leave it out and ask Gigi.

## Syncing
Gigi's PC copy (`Downloads\Gigi Vault`) is a clone of the repo and backs up with the Obsidian Git plugin. Cloud agents: clone the repo, edit, commit to `main` with a clear message, and push. Pull before you edit.

## Conventions
- Wikilinks `[[Note name]]`, not Markdown links, for notes inside the vault.
- Every note has frontmatter with at least `type`, `status` (where it applies), `created`, `updated`.
- Allowed `type` values: `project`, `system`, `decision`, `runbook`, `memory`, `daily`, `moc`, `resource`, `meta`.
- Dates are absolute (`2026-11-09`), never "yesterday".
- One subject per note. Keep notes short and scannable; link instead of repeating.
