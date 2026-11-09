---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook, skills, claude]
system: claude.ai
---
# Install a Claude skill

How to add or update one of the project's Claude skills in Gigi's claude.ai account. The master copy of every skill lives in this vault under `60 Resources/Skills/<skill-name>/`.

## Steps
1. Get the zip. Agents leave a ready one in the project's shared files and in `Downloads` (for example `review-criteria.zip`). To build it yourself, zip the skill's **folder**, not its contents: the zip must hold `<skill-name>/SKILL.md` at its top level.
2. Open claude.ai, then **Settings > Capabilities > Skills**.
3. Choose **Upload skill** and pick the zip.
4. Check the skill is listed and switched on.

## Updating a skill
Edit the master copy in the vault, zip the folder again, and upload it. Keep the `name:` in `SKILL.md` unchanged so it stays the same skill; if claude.ai doesn't offer to replace the old version, remove the old one first, then upload.

## Gotchas
- One `SKILL.md` per zip. A second `SKILL.md` anywhere inside the folder makes the upload fail; reference files go in `references/` with other names.
- The `description:` line decides when Claude uses the skill: keep it specific, under 1024 characters, with no `<` or `>`.

Related: [[Professional UI design skill]], [[Browser scenario testers skill]], [[Review criteria skill]].
