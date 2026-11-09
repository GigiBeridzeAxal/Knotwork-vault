---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork, editor]
supersedes:
superseded-by:
---
# ADR-0010 Knotwork canvas is nested blocks drawn from the steps

## Context
Phase 3 of the [[Knotwork system plan]] adds a visual editor, version history and testing one step. The engine runs a workflow as an ordered list of steps; phase 2 adds "if" and "loop" steps that hold their own lists. The app runs on free plans ([[ADR-0003 Knotwork runs on the Cloudflare free plan]]), so anything stored has to stay small.

## Options
1. **Free graph** (like n8n): nodes anywhere, wires between any two. Needs stored positions, a second data model, and checks against endless loops.
2. **Nested blocks, laid out automatically.** The canvas is a drawing of the same steps the list editor edits. Chosen.

## Decision
- **One data model.** The canvas reads and changes the workflow's `steps`. An "if" step holds `then` and `else` lists, a "loop" holds `steps`. All tree work goes through `shared/tree.ts`, which finds child lists by key, so the canvas needs no change when a new block type arrives.
- **No stored positions.** `src/canvas/layout.ts` places every node from the steps each time: top to bottom, a block's lists side by side under it. Nothing about the drawing is saved, so the list view and the canvas can never disagree.
- **Canvas is the default view**; the step list stays as a second view. The choice is remembered in the browser.
- **Version history is a copy per save.** Collection `versions`, id `workflowId:version`. Kept: the newest 20 and at most 128 KB per workflow; nothing is written while the storage guard says the database is nearly full. Restoring loads a version into the editor and only replaces the current one on Save.
- **Testing a step runs it for real, once.** `POST /api/steps/test` runs the step through the same code as a run (same private-address check, demo host allow-list, timeout and size caps), stores nothing, and is limited to 60 an hour per account (per network for the demo). Sample data comes from the newest finished run, cut to 32 KB.
- **Templates and imports open unsaved.** A template or an imported file loads into a new, unsaved workflow, so nothing is created until Create is pressed. An import goes through the same checks as a save.

## Consequences
- No endless loops are possible, and a workflow reads top to bottom.
- A step can't jump to an arbitrary other step. If that is ever needed, it is a new decision.
- Reordering by dragging works with a mouse; on a phone the panel's Move up and Move down buttons do it.
- An exported file holds whatever was typed into the steps, keys in headers included. The export screen says so.
- The `versions` collection needs its index (`workflowId`, `version`); the hourly index check adds it after the first deploy.
- The cloud build machines have no database, so database tests and browser scenarios run in GitHub Actions, not locally.

Related: [[Knotwork]], [[Knotwork system plan]]
