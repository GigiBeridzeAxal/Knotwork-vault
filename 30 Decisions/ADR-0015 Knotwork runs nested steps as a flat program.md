---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork, engine]
supersedes:
superseded-by:
---
# ADR-0015 Knotwork runs nested steps as a flat program

## Context
Phase 2 of the [[Knotwork system plan]] adds "if / else" and "loop" steps that hold their own steps. Until now a run was a position in a flat list (`run.stepIndex`) and could stop after any step and continue on the next tick. That pause-and-continue behaviour has to survive nesting, old workflows and runs that are in flight during the deploy have to keep working, and everything still runs on free plans ([[ADR-0003 Knotwork runs on the Cloudflare free plan]]).

## Options considered
1. **Walk the tree with a stack of frames** stored on the run. Natural to write, but the stored position becomes a path plus loop counters, and old runs need a migration.
2. **Compile the tree to a flat list of operations with jumps**, and keep `stepIndex` as an index into that list. Chosen.

## Decision
- **Stored shape.** An "if" step is `{ type: "if", config: { left, op, right }, then: [...], else: [...] }`. A "loop" step is `{ type: "loop", config: { items }, steps: [...] }`. Child lists sit on the step itself, not inside `config`. This is the shape the canvas draws ([[ADR-0010 Knotwork canvas is nested blocks drawn from the steps]]).
- **Compile on use.** `worker/program.ts` turns the tree into operations: run a step, test an "if" (jump to the else part when false), jump, start a loop, next loop pass. A workflow without blocks compiles to one operation per step, so `stepIndex` means what it always meant and nothing is migrated.
- **Loop state lives in the run's outputs.** While a loop runs, its output is `{ items, index, count }`; when it ends it becomes `{ count }`. A paused run therefore continues mid-loop with no extra fields.
- **Each pass overwrites.** A step inside a loop keeps only its latest output. Log lines carry `depth` and `pass` ("2 of 3") so the run page can indent and label them.
- **Each pass starts clean.** When a loop moves to its next item, the outputs of the steps inside it are cleared, so a step the new pass skips (the other side of an "if") can't show the last item's result.
- **Hard limits** (in `shared/limits.ts`): 25 steps per workflow counting nested ones, blocks 3 deep, 50 items per loop, 200 step runs per run, 100 log lines per run.
- **What counts toward the 200:** every time a step runs. That is each pass of a loop, each retry, each "if" check and each start of a loop. Moving a loop to its next item does not count, so 50 items with 3 steps inside is 151 and fits. Counting the moves made that same loop fail after it had done all its work (found in review).
- **Saving in batches.** A step that reaches outside (an HTTP call, a delay) starts from a saved place and is saved right after, so a Worker that stops can't make it happen twice. Steps that only compute ("if", transform, filter, log, a loop moving on) are saved together, every 25 log lines or every second. If the Worker stops in between they run again and give the same result. Before this a 50-item loop cost about 200 database writes; now it costs a handful, which matters on the free database.
- **Requests are rationed.** Cloudflare's free plan allows 50 outgoing requests per invocation. A run makes at most 30 in one go, and the runs woken in the same minute at most 40 together; a run that reaches that parks with a note and carries on within a minute.
- **What templates can read:** `{{ loop.item }}`, `{{ loop.index }}`, `{{ loop.count }}`, `{{ steps.<loop id>.item }}` and `{{ steps.<if id>.result }}`.
- **Not built:** an "on failure" step. The plan lists it; it was left out of phase 2 on purpose.

## Consequences
- No endless loops are possible: every loop has a fixed list and the run has a step budget.
- Old workflows, old runs and the list editor keep working unchanged.
- A run keeps its own copy of the steps from when it started, so editing the workflow doesn't disturb a run that is paused.
- Results of earlier loop passes are not kept. To collect results, send them somewhere inside the loop.
- A loop of more than 30 requests takes more than one minute to finish, by design.
- A new block type means a new operation in `worker/program.ts` and a new child list key in `childLists()` (`shared/schema.ts`).

Related: [[Knotwork]], [[Knotwork system plan]]
