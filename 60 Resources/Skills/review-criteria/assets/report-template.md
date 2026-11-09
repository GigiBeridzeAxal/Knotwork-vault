# Review: <what was reviewed, in plain words>

| | |
|---|---|
| **Reviewed** | <repo and PR link, branch, path, or URL> |
| **Version** | <head branch @ short SHA> against <base @ short SHA> |
| **Mode** | <Change review / Project audit / Live check / Self-review> |
| **Goal source** | <where the goal came from: the request, issue #, plan; or "none written, inferred"> |
| **Date** | <YYYY-MM-DD> |
| **Reviewer** | <who or what ran the review> |
| **Ran** | <e.g. build ✓, typecheck ✓, tests 41/42 (1 new failure), app started ✓, perf probe ✓; not run: X because Y> |

## Verdict: <APPROVE | WARN | BLOCK>

<One or two plain sentences: can this ship as it is, and what is the single most important thing to do. If a BLOCK rests only on PLAUSIBLE findings, say so here.>

| Criterion | Rating | Score | Main reason |
|---|---|---|---|
| Security | <PASS/WARN/BLOCK> | <n>/10 | <one line> |
| Performance | <PASS/WARN/BLOCK> | <n>/10 <(estimated) if not measured> | <one line> |
| Logic and goal | <PASS/WARN/BLOCK> | <n>/10 <(from reading) if not run> | <one line> |
| Documentation | <PASS/WARN/BLOCK> | <n>/10 | <one line> |

<!-- Only if there are any. Pre-existing CRITICAL or HIGH security problems found in untouched code. -->
> **Security alert:** <S#, one line: what it is and why it needs action now, even though this change didn't cause it.>

## Fix before shipping

<!-- Every fix that moves a rating up (BLOCK to WARN, WARN to PASS), most important first. If there are none, write "Nothing. Ready to ship." For work already merged or live, call this section "Fix next". -->
1. **<ID>** <the fix in one line> (moves <criterion> to <rating>)
2. ...

---

## 1. Security: <n>/10, <rating>

### Threat model
- **Assets:** <...>
- **Entry points:** <...>
- **Trust boundaries:** <...>
- **Attackers:** <...>

### Coverage
<!-- One row per area in references/security.md. "Clean" means checked and nothing found. For a small change, collapse the rows that don't apply into one line below the table: "n/a: authentication, SSRF, ..." -->
| Area | Result | Notes |
|---|---|---|
| Authentication and sessions | <Clean / S# / n/a> | <how it was checked> |
| Authorization and tenant isolation | | |
| Injection and input handling | | |
| Outbound requests and SSRF | | |
| Code execution and sandboxing | | |
| Secrets and credentials | | |
| Data exposure and privacy | | |
| Web platform hardening | | |
| Abuse, DoS and cost | | |
| Dependencies and supply chain | | |
| Infrastructure and configuration | | |
| Local and LAN services | | |
| Cryptography and randomness | | |
| AI and LLM features | | |
| File uploads and downloads | | |

### Findings
<!-- Most severe first, in the finding format. Security findings add Attacker, Path and Impact. "None." if clean. -->

#### S1 · <SEVERITY> · <CONFIRMED/PLAUSIBLE> · <title>
- **Where:** `<file:line>`
- **Attacker:** <who>
- **Path:** <how they reach it, step by step>
- **Impact:** <what they get>
- **Fix:** <change, with a short code sketch>
- **Check:** <test or command that proves the fix>

### To reach 10
1. <fix> → <score>

---

## 2. Performance: <n>/10, <rating>

### Hot paths and budgets
- **Hot paths:** <where users wait, what runs most>
- **Load:** <today, and at 10x>
- **Budgets used:** <the project's own, or the defaults from references/performance.md>

### Measurements
<!-- Median of N runs, with the range. Mark anything estimated. Keep only the rows that fit the work and add your own:
     web pages: LCP, CLS, TBT, click latency, JS and total transferred, requests;
     APIs: p50 and p95 server time, queries and rows read per request, payload size;
     jobs and serverless: CPU per invocation, rows read and written per run, subrequests, daily total against the plan's quota. -->
| Metric | Budget | Base | Head | Change | Method |
|---|---|---|---|---|---|
| <e.g. LCP, mobile> | <≤ 2.5 s> | | | | <web-perf.cjs, 10 runs> |
| <e.g. rows written per run> | <daily quota ÷ expected runs> | | | | <getPlatformProxy, result.meta> |

### Problems report
<!-- Every problem and worthwhile improvement, including ones found along the way (they stay here, with their numbers, so they aren't lost; they don't count toward a change review's score). Details follow the table for the ones that count. -->
| ID | Problem | Where | Type | Cost now | Better approach | Expected gain | Effort | Severity |
|---|---|---|---|---|---|---|---|---|
| P1 | | | <Regression / Missed improvement / Found along the way> | | | | <S/M/L> | |

#### P1 · <SEVERITY> · <CONFIRMED/PLAUSIBLE> · <title>
- **Where:** `<file:line>`
- **Cost now:** <what, how often, at what size; measured or estimated>
- **Better approach:** <with a short code sketch>
- **Expected gain:** <number, and how sure>
- **Check:** <how to measure the gain>

### Best value first
1. **<P#>** <one line> (gain <...>, effort <S/M/L>)
2. ...

### Headroom
<n>/10 now → <m>/10 after <P#, P#>.

### To reach 10
1. <fix> → <score>

---

## 3. Logic and goal: <n>/10, <rating>

### The goal
> <the goal, quoted>

Source: <where it came from>. <If ambiguous: the readings considered and the one the work chose.>

### Requirements
| # | Requirement | Kind | Status | Evidence | Gap and fix |
|---|---|---|---|---|---|
| R1 | | <Explicit / Implied / Constraint / Non-goal> | <Met / Partial / Missing / Wrong> | `<file:line>`, <run output> | |

### Findings
<!-- Logic problems written as inputs → wrong outcome → fix. Most severe first. -->

#### L1 · <SEVERITY> · <CONFIRMED/PLAUSIBLE> · <title>
- **Where:** `<file:line>`
- **What happens:** <inputs → wrong outcome>
- **Fix:** <...>
- **Check:** <...>

### Edge cases
| Case | Handled? | Evidence |
|---|---|---|
| | <Yes / No (L#) / n/a> | |

### Scope map: nothing more
| Change | Serves | Note |
|---|---|---|
| | <R# / support / nothing> | |

### Leftovers: nothing less
<TODOs, stubs, debug code, mock data, skipped tests found in the changed lines, or "None found" with the search used.>

### What shipping still needs
<Deploys, migrations, env vars, DNS, dashboard settings, dependent changes. Say which are already listed in the work.>

### To reach 10
1. <fix> → <score>

---

## 4. Documentation: <n>/10, <rating>

### Inventory
| Doc | Audience | Needed for this work | Exists | Accurate | Current |
|---|---|---|---|---|---|
| README | Developers | | | | |

### Verified
<Which documented commands and steps were run, and the result.>

### Findings

#### D1 · <SEVERITY> · <CONFIRMED/PLAUSIBLE> · <title>
- **Where:** `<file:line>` or <the missing doc>
- **What happens:** <who fails or is confused, and how>
- **Fix:** <the text to add or change>

### To reach 10
1. <fix> → <score>

---

## Tests and checks
| Check | Base | Head | Notes |
|---|---|---|---|
| Build | | | |
| Typecheck | | | |
| Lint (changed files) | | | |
| Tests | | | |

## Found along the way (not counted)
<!-- Pre-existing problems in code this work didn't touch. Not part of the scores. Performance items already in the problems report are listed by ID only. -->
- <criterion, severity, file:line, one line>

## Not checked
<!-- What wasn't checked and why, so a PASS isn't read as more than it is. -->
- <...>
