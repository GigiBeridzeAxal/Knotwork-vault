# Performance

**The question:** how fast and how cheap is this for its users at its real load, did the work make anything slower, and could it be notably faster or cheaper?

This criterion produces two things: a **score** and a **problems report**. The problems report lists every problem and every worthwhile improvement, each with its cost today, the better approach, the expected gain and the effort, so the person can decide what to do next.

## Contents
- P0 Decide what matters: hot paths, load, budgets
- P1 Measure (before and after)
- P2 Look for problems, layer by layer
- P3 Write each problem
- P4 Rank the improvements
- P5 Score and headroom
- Rules of judgment
- Severity guide and score anchors

---

## P0 Decide what matters

1. **Hot paths.** Where does a user wait, and what runs most often? First page load, the key interaction, the main API call, a background job, a build. Performance work off the hot path rarely matters.
2. **Load and size.** How many users, requests, rows, items or bytes today, and at 10x? An O(n²) loop is fine at n = 20 and fatal at n = 20,000.
3. **Budgets.** Use the project's own budgets first (README, CI checks, a `performance:budget` script, an ADR). Otherwise use the defaults below and say so in the report.

**Default budgets** (state which ones you used):

| Area | Budget |
|---|---|
| Web page, mobile, 75th percentile (Core Web Vitals "good") | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. Also FCP ≤ 1.8 s, TTFB ≤ 0.8 s. "Poor" starts at LCP > 4 s, INP > 500 ms, CLS > 0.25. |
| Lab proxy for INP | Total Blocking Time (TBT) ≤ 200 ms on a throttled mobile profile |
| JavaScript on first load (compressed) | Heuristic: ≤ ~100 KB for a content or marketing page, ≤ ~200 KB for an app shell |
| Images | Sized to their display size (≤ 2x for high-DPI), AVIF or WebP, lazy-loaded below the fold; the LCP image is never lazy and gets `fetchpriority="high"` |
| Video | A poster image, `preload="none"` or `"metadata"`, compressed, sized to the viewport; a lighter option on phones |
| Fonts | 2 to 3 files on first load, `woff2`, subset, `font-display: swap` or `optional`, the critical one preloaded |
| API, simple read | Heuristic: p95 server time ≤ ~200 ms; writes ≤ ~500 ms |
| Serverless or edge functions | Within the plan's CPU, memory and duration limits with headroom. Look up the current limits for the plan in use; don't rely on memory. Free plans often allow very little CPU per request. |
| Quotas (requests per day, database and KV reads and writes, storage, email) | Expected usage at most half the plan's limit |

## P1 Measure

Measure base and head under the same conditions, so you can tell a regression from noise.
- Same machine, same build mode (production), a warm-up run first, then at least 5 runs (10 for browser metrics). Report the **median** and the spread (min to max, or p95).
- Treat differences smaller than the spread as noise.

**Web pages.** Use the bundled script (needs Node and Playwright with Chromium):
```bash
node scripts/web-perf.cjs http://localhost:4173/ --runs 10 --profile mobile
node scripts/web-perf.cjs http://localhost:4173/ --runs 10 --profile mobile --json head.json   # save for comparison
```
It loads the page with a fresh cache under mobile CPU and network throttling and reports median and range for TTFB, FCP, LCP (and which element), CLS, TBT, JS and total transfer size and request count, with a budget check. Add `--compare base.json` to print the change against a saved base run. Run it on a local production build or a preview URL, never against someone else's site at volume. Lighthouse (`npx lighthouse <url> --preset=perf --form-factor=mobile`) is a good second opinion.

**Interactions.** When the work changes what happens on a click, measure the click too:
```bash
node scripts/web-perf.cjs http://localhost:4173/ --runs 10 --click "#contact button"
```
It clicks the element once per run after load, under the same throttling, and reports the interaction latency (the longest event of that interaction, as INP measures it; under 16 ms shows as "under 16 ms"). Pick an element that doesn't navigate away.

**Bundle size.** Read the build output's chunk sizes (Vite, Next.js and most bundlers print them) on base and head and compare the compressed sizes. For a breakdown, use the bundler's analyzer.

**Other interactions** (typing, dragging, scrolling): record a Performance trace in DevTools or use the `PerformanceObserver` event-timing API, and count long tasks (> 50 ms) during the interaction. For React, the Profiler shows re-render counts.

**Backend.** Time the handler locally (dev server or a local Worker):
```bash
for i in $(seq 30); do curl -s -o /dev/null -w '%{time_total}\n' http://localhost:8787/api/thing; done | sort -n | awk '{a[NR]=$1} END {print "median", a[int(NR/2)+1], "p95", a[int(NR*0.95)]}'
```
Count queries per request (log them), check query plans (`EXPLAIN QUERY PLAN` for SQLite and D1, `EXPLAIN ANALYZE` for Postgres), and confirm indexes exist for every filter and sort.

**Rows read and written per operation** decide cost and quotas on most serverless databases, so measure them for the hot paths (one request, one run, one scheduled tick), then multiply by expected volume and compare with the plan's daily limits. Cloudflare D1 returns them on every result as `meta.rows_read` and `meta.rows_written`; locally, get the binding with `getPlatformProxy()` from `wrangler` and log `result.meta` for each statement (`wrangler d1 execute` doesn't show them). Postgres shows buffers with `EXPLAIN (ANALYZE, BUFFERS)`.

**Memory and leaks.** Repeat the action 20 times and watch memory (heap snapshots, `performance.memory`, process RSS). Look for listeners, timers, observers, sockets and caches that grow without bound.

**Never** load-test production, shared or third-party services. Local or preview only, at low rates.

**When you can't measure**, estimate from first principles (bytes over the wire, round trips × latency, complexity × realistic n), label the number "estimated", and say what would measure it. The score is then capped at 8.

## P2 Look for problems, layer by layer

**Page loading**
- Render-blocking CSS or scripts in the `<head>`; scripts without `defer` or `async`.
- Heavy JavaScript: a large library for a small job, whole-library imports, no code splitting, client-side rendering of content that could be static or server-rendered.
- Images and video not sized, compressed or lazy-loaded; the LCP element discovered late (a background image in CSS, an image injected by JS, a lazy-loaded hero).
- Request waterfalls: data fetched only after a component renders, chained requests that could run in parallel or be preloaded.
- Missing compression or caching: hashed static assets should be `Cache-Control: public, max-age=31536000, immutable`; HTML short-lived.
- Third-party scripts (analytics, chat, embeds) loaded eagerly; fonts blocking text.
- Layout shift: images and embeds without dimensions, late fonts, content inserted above what the user is reading.

**Runtime and interaction**
- Long tasks on interaction; expensive work in render; unnecessary re-renders (unstable props or context, state too high in the tree).
- Scroll and resize handlers without throttling or `passive: true`; animating layout properties (`top`, `width`) instead of `transform` and `opacity`.
- `requestAnimationFrame`, canvas or WebGL loops, videos and timers that keep running when off-screen or when the tab is hidden.
- Large lists without virtualization; polling where an event or push would do.
- Leaks: listeners, intervals, observers and subscriptions never cleaned up; object URLs never revoked.
- `prefers-reduced-motion` and `Save-Data` ignored for heavy effects.

**Network and API**
- N+1 calls (one request per item), duplicate calls for the same data, over-fetching (large payloads the client doesn't use), no pagination.
- Sequential `await`s on independent work that could run together (`Promise.all`).
- No caching where data rarely changes (HTTP caching, ETags, a CDN or edge cache, an in-memory cache with a bound and an expiry).
- No timeouts; retries without backoff.

**Backend and data**
- Queries without an index (full scans), N+1 queries, `SELECT *`, queries without `LIMIT`, many small writes that could be one batch or transaction.
- Work in the request path that could run after the response (`waitUntil`, a queue, a scheduled job).
- Cold-start weight: large imports at the top level, initialization on every request instead of once.
- CPU-heavy work (big JSON, crypto, image processing, complex regex) on platforms with tight CPU limits.
- Scheduled jobs that scan everything on every run instead of only what changed.

**Algorithms and data structures**
- Nested loops over data the user controls; `array.find` or `includes` inside a loop (use a `Map` or `Set`); repeated sorting; string building in a loop; regexes with catastrophic backtracking.

**Cost and quotas**
- Writes, reads, emails or paid API calls per request multiplied by expected traffic, compared with the plan's limits. Logging volume. Cron frequency. Egress.

## P3 Write each problem

Every entry in the problems report has:

| Field | Content |
|---|---|
| **ID and title** | `P1`, a plain-language title |
| **Where** | `file:line` |
| **Type** | **Regression** (the work made it slower), **missed improvement** (the work's own code could be notably faster), or **found along the way** (pre-existing, untouched; not counted in change reviews) |
| **Cost now** | What it costs, how often, at what size. Measured ("LCP 3.9 s median of 10, mobile profile") or estimated ("about 40 KB extra JS per visit, estimated"). |
| **Better approach** | What to do instead, with a short code sketch |
| **Expected gain** | A number, with how sure you are ("LCP −1.2 s, measured on a prototype" or "≈ −30% server time, estimated") |
| **Effort** | S (under an hour), M (a day or less), L (more) |
| **Severity** | From the guide below |

## P4 Rank the improvements

Sort the improvements by gain divided by effort. Quick wins (high gain, small effort) come first; name the top three. For each, say which budget or metric it moves.

## P5 Score and headroom

Score the work as it stands, then state the **headroom**: the score it would reach if the top improvements landed ("6/10 now, 9/10 after P1 and P2"). This tells the person how much better it can get and what it takes.

---

## Rules of judgment

- **Change review vs audit.** In a change review, score what the change adds or touches. Budgets the base already missed go in the problems report as "found along the way" (with their numbers, so they aren't lost) and don't lower the score, unless the change makes them worse. In a project audit they count.
- **Regression vs missed improvement.** A regression the work introduces, when a feasible better approach exists, is judged at the severity of its cost. A missed improvement (the work is acceptable but could be notably better) is at most MEDIUM, unless the current state breaks a budget or a limit, in which case it's a problem in its own right. An unavoidable regression (the cost of a requested feature, with no better feasible approach) is LOW if it stays within budget and MEDIUM if it crosses one; state its cost either way.
- **Micro-optimizations** that hurt readability for a small gain (under ~5 to 10%) on a cold path are LOW or not worth listing.
- **Correctness and security first.** Never recommend a speed-up that weakens them (dropping validation, caching private data publicly, removing a needed check).
- **Prefer the platform** (static generation, CDN and HTTP caching, image optimization, edge caching, built-in batching) over custom machinery.
- **Numbers or it didn't happen.** "Feels faster" is not a measurement. Every claimed gain carries a number and how it was obtained.

## Severity guide

| Level | Performance examples |
|---|---|
| **CRITICAL** | Fails at expected load: exceeds a hard platform limit (CPU, memory, duration) so requests error; exhausts a free quota or starts a bill at normal traffic; unbounded growth (a memory leak, O(n²) on realistic n); the UI freezes. |
| **HIGH** | Clearly slow on a main path: a Core Web Vital in the "poor" range, API time several times its budget, N+1 queries or a request waterfall at realistic size, initial JS roughly doubled, a regression above ~25% on a key metric when a better approach exists. |
| **MEDIUM** | Noticeable but not severe: a budget missed by a small margin, sequential awaits that could be parallel on a main path, a missing cache on repeated work, oversized images, CLS above 0.1, a notable missed improvement (about 20% or more on a main-path metric). |
| **LOW** | Small wins (under ~10%), cold paths, micro-optimizations, tidy-ups. |

## Score anchors

| Score | What it looks like |
|---|---|
| **10** | Measured; no regression; every budget met with headroom; nothing above LOW left to gain; scales to 10x load without redesign. |
| **9** | Measured; within budgets; one or two LOW improvements left. |
| **8** | Within budgets with LOW improvements only; or looks clean but estimated, not measured. |
| **7** | One MEDIUM: a notable missed improvement, a small budget miss, or a noticeable regression. |
| **6** | Several MEDIUMs. |
| **4-5** | One HIGH: user-visible slowness on a main path, a clear budget miss, or a regression with a better approach available. 3 with several. |
| **1-2** | A CRITICAL: fails at expected load, breaks a hard limit or quota, unbounded growth. |
| **0** | Unusable: times out or crashes under normal use. |
| **n/a** | No runtime code (docs or config with no runtime effect). Write "PASS, n/a" with the reason. |
