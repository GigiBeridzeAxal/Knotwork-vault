---
type: decision
status: accepted
created: 2026-11-25
updated: 2026-11-26
date: 2026-11-25
tags: [decision, site, cloudflare, assistant]
supersedes:
superseded-by:
---
# ADR-0037 Onyx answers first with Claude Haiku 5.5, paid per use

## Context
On 2026-11-25 Gigi asked to "setup api for claude for onyx haiku 5.5 medium": the chat on [[gigiberidze.com]] should answer with Claude Haiku 5.5 at medium effort. Until now Onyx answered from a free Workers AI model, with the FAQ as the fallback ([[ADR-0034 The site assistant answers from the site's facts on a free model]]). Claude is billed per use, so this is the site's first running cost. Gigi adds the API key later; the code has to work, unchanged, before the key exists.

When this is accepted it supersedes ADR-0034's choice of engine (option 3 there) only; the facts, rules, limits and FAQ fallback of ADR-0034 stay. ADR-0034 stays accepted until then.

## Options considered
1. Keep the free Workers AI model only. No cost, weaker answers, and a daily allowance of about 140 to 230 answers.
2. Claude only. Best answers, but any Anthropic outage, rate limit or spent credit takes the chat down.
3. Claude Haiku 5.5 first, then the existing Workers AI model, then the FAQ answer.

## Decision
Option 3, at Gigi's request. Built on gigiberidze.com branch `claude/project-thread-mjpny3`, not merged.
- Model `claude-haiku-5-5`, `output_config.effort` `medium`, through the official SDK `@anthropic-ai/sdk` (pinned). Both are vars (`CHAT_CLAUDE_MODEL`, `CHAT_CLAUDE_EFFORT`), so they change without code.
- Price (prompts up to 100K tokens): $0.10 per million input tokens, $0.50 per million output tokens; cached input is read at a tenth of the input price. Thinking is billed as output.
- The same system prompt (facts and rules) and the same output cleaning and price backstop as Workers AI. The prompt is sent as a cached block.
- If Claude declines a question on safety grounds, Onyx says politely that it cannot help, and the question is not passed to the weaker model. Any error, timeout (20 s) or empty answer falls through to Workers AI, then the FAQ.
- The key is a Worker secret named `ANTHROPIC_API_KEY`, set in the Cloudflare dashboard (Worker `gigiberidze`, Settings, Variables and Secrets, type Secret) or with `npx wrangler secret put ANTHROPIC_API_KEY`. Its value is never in a repo, a test, a log or this vault. Deleting the secret turns Claude off.
- Guardrails: the existing visitor limits (same site, 8 KB, 500 characters, 20 questions, 8 a minute per address), plus a second Cloudflare rate limit of 30 Claude calls a minute for the whole site; past it the chat uses Workers AI. Cloudflare rate limits only count per 10 or 60 seconds, so the money cap is on the Anthropic side: prepaid credit with auto-reload off and a workspace spend limit, set by Gigi.
- Each Claude answer logs one line with its token counts (input, output, cache read and write), never the conversation, so the cost can be checked in the Worker logs.

## Consequences
- Better answers in English and Georgian, at a small cost per answer: the system prompt is roughly 5,100 tokens, so an answer costs about $0.0001 to $0.001 (more if the cache is cold or the model thinks long).
- The site now has a bill. The worst case at 30 calls a minute is about 43,000 calls a day, so the Anthropic credit and spend limit must be set before the key is added.
- Visitor questions go to Anthropic as well as Cloudflare. Nothing is stored by the site.
- Until the key is added, nothing changes for visitors.
- Which engine answered shows in the `engine` field of each `/api/chat` reply: [[Test the site assistant]].
