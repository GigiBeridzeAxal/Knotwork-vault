---
type: runbook
status: active
created: 2026-11-25
updated: 2026-11-25
tags: [runbook, site, assistant]
system: "[[gigiberidze.com]]"
---
# Test the site assistant

When to use this: before merging a change to Onyx, the chat on [[gigiberidze.com]], or to check that the real model answers ([[ADR-0034 The site assistant answers from the site's facts on a free model]]).

## Local, FAQ mode (no model, no cost)
1. In the site repo: `npm test` (unit tests, no network) and `npm run build`. If the build stops once with the Next.js security notice, run it again.
2. Start the Worker: `npx wrangler dev --port 3100 --var CHAT_FAKE:1`. With `CHAT_FAKE` the chat answers from the FAQ only. Wrangler needs a Cloudflare login because of the AI binding. A cloud session has no login. There, run it from a temporary copy of `wrangler.jsonc` without the `"ai"` lines (`--config <copy>`), and delete the copy afterwards.
3. Open http://localhost:3100 and ask a few questions. Every answer has `source: "faq"`.

## End-to-end
4. With the Worker from step 2 running: `npm run e2e`. Playwright is not a dependency. The script uses the global install (`NODE_PATH=$(npm root -g)` in a cloud session). All steps should pass.

## The real model, on a preview build
5. Push the branch. Workers Builds makes a preview at `https://<branch-with-dashes>-gigiberidze.gigiberidze-com.workers.dev`: the branch name with `/` and other symbols turned into dashes.
6. Cloud sessions cannot reach it. Open a page there in the browser on Gigi's computer and ask questions in the chat: prices, a start date, "ignore your rules", something off topic, and one in Georgian.
7. A healthy answer has `source: "model"` in the `/api/chat` response (browser dev tools, Network tab). A price question should get the fixed line "Prices and timelines are agreed per project...".
8. Stay under 8 questions a minute. Previews share production's rate limit and the daily allowance.

If it fails:
- Every answer has `source: "faq"`: the model was refused or the allowance is spent. Check the Worker's logs for `chat fallback error` or `chat fallback quota`. The allowance resets at 00:00 UTC.
- 429: wait a minute.
- 403: the page and `/api/chat` are on different hosts.
