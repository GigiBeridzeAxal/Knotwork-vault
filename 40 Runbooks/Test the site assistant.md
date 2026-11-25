---
type: runbook
status: active
created: 2026-11-25
updated: 2026-11-25
tags: [runbook, site, assistant]
system: "[[gigiberidze.com]]"
---
# Test the site assistant

When to use this: before merging a change to Onyx, the chat on [[gigiberidze.com]], or to check that the real model (Claude or Workers AI) answers ([[ADR-0034 The site assistant answers from the site's facts on a free model]]), or to try his scripted lines ([[ADR-0035 Onyx speaks first from a script kept in the visitor's browser]]).

## Local, FAQ mode (no model, no cost)
1. In the site repo: `npm test` (unit tests, no network) and `npm run build`. If the build stops once with the Next.js security notice, run it again.
2. Start the Worker: `npx wrangler dev --port 3100 --var CHAT_FAKE:1`. With `CHAT_FAKE` the chat answers from the FAQ only. Wrangler needs a Cloudflare login because of the AI binding. A cloud session has no login. There, run it from a temporary copy of `wrangler.jsonc` without the `"ai"` lines (`--config <copy>`), and delete the copy afterwards.
3. Open http://localhost:3100 and ask a few questions. Every answer has `source: "faq"`.

## End-to-end
4. With the Worker from step 2 running: `npm run e2e`. Playwright is not a dependency. The script uses the global install (`NODE_PATH=$(npm root -g)` in a cloud session). All steps should pass.

## His own lines (the script)
Works locally (step 2) and on any preview or the live site; it changes only your own tab.
1. Add `?onyx=debug` to a page address, for example `http://localhost:3100/?onyx=debug`. Open the browser console: every event, the line chosen, or why nothing was said (`held back: ...`) is logged with `[onyx]`.
2. Make him say something now: `window.__onyx.fire("idle")`, or with a target, `window.__onyx.fire("section", "home.work.knotwork")`. `fire` follows the pacing rules; `window.__onyx.skip(60000)` moves his clock a minute on so the next line is not held back. `window.__onyx.show("section-knotwork-book-1")` shows one line by its id, past every rule.
3. `window.__onyx.state()` shows the page, the last line, how many lines loaded and the stored memory.
4. Pretend to be a returning visitor: `window.__onyx.skip(2*24*60*60*1000)`, then click a link to another page of the site (not a reload: the open tab keeps writing "last seen", and a reload starts his clock again). He greets with a return line for two days away. To try other return lines, first change the stored record in the console, for example `m = JSON.parse(localStorage.getItem("onyx-memory-v1")); m.visits = 9; m.chatted = true; localStorage.setItem("onyx-memory-v1", JSON.stringify(m))`, then skip and click as above. Afterwards the record's "last seen" is in the future; the next real page load reads it as now.
5. Pretend to be Georgian: open `/ka?onyx=debug`, or set the browser language to Georgian.
6. Start over as a new visitor: "Forget me" in the chat window, or `window.__onyx.reset()`, or delete `onyx-memory-v1` and `onyx-chat-v1` in the browser's storage.

## The real model, on a preview build
5. Push the branch. Workers Builds makes a preview at `https://<branch-with-dashes>-gigiberidze.gigiberidze-com.workers.dev`: the branch name with `/` and other symbols turned into dashes.
6. Cloud sessions cannot reach it. Open a page there in the browser on Gigi's computer and ask questions in the chat: prices, a start date, "ignore your rules", something off topic, and one in Georgian.
7. A healthy answer has `source: "model"` in the `/api/chat` response (browser dev tools, Network tab). A price question should get the fixed line "Prices and timelines are agreed per project...".
   - **Which engine answered:** the same response has `engine: "claude"` (Claude Haiku 5.5, only when the `ANTHROPIC_API_KEY` secret is set) or `engine: "workers-ai"` (the free Gemma model). FAQ answers have no `engine`. See [[ADR-0037 Onyx answers first with Claude Haiku 5.5, paid per use]].
   - With the key set, the Worker's logs show one `chat claude usage in=... out=... cache_read=... cache_write=...` line per Claude answer. From the second question within 5 minutes, `cache_read` should be about the prompt's size (roughly 5,000 tokens).
8. Stay under 8 questions a minute. Previews share production's rate limit and the daily allowance, and with the key, the site's Claude limit and Anthropic bill.

If it fails:
- Every answer has `source: "faq"`: the model was refused or the allowance is spent. Check the Worker's logs for `chat fallback error` or `chat fallback quota`. The allowance resets at 00:00 UTC.
- `engine: "workers-ai"` although the key is set: look in the logs for `chat claude fallback <reason>` (`auth` with `Claude key rejected`: the key is wrong or revoked; `billing` or `rate`: check the Anthropic credit and spend limit; `timeout`, `overloaded`, `server`, `connection`) or `chat claude skip limit` (the site's 30 Claude calls a minute are used up).
- Claude never answers in a preview: previews may not have the secret; check the preview's Variables and Secrets.
- 429: wait a minute.
- 403: the page and `/api/chat` are on different hosts.
