---
type: decision
status: accepted
created: 2026-11-25
updated: 2026-11-27
date: 2026-11-25
tags: [decision, site, cloudflare, assistant]
supersedes:
superseded-by:
---
# ADR-0034 The site assistant answers from the site's facts on a free model

## Context
On 2026-11-25 Gigi asked for an AI agent on [[gigiberidze.com]] that talks to visitors in Gigi's name: about Gigi, the services, [[Knotwork]], [[Rouse]] and how to hire. It must cost nothing to run. The site is static files on a Cloudflare Worker ([[ADR-0002 Host the site on Cloudflare Workers with Builds]]), and its facts already live in a few files ([[ADR-0033 Be findable by search and AI assistants with plain facts]]).

## Options considered
1. Rule-based only, like the lead demos in [[ADR-0030 Lead demos are one Cloudflare Worker with a rule-based assistant]]: free and predictable, but it can only match questions to fixed answers.
2. A paid model API: better answers, but it costs money per message and needs a key and a billing account.
3. A free Workers AI model on the site's own Worker, with the FAQ answers as the fallback.

## Decision
Option 3. Gigi approved the plan (https://claude.ai/artifact/A4SioXA9jUbV6Ludh7Dnu9) and the character (https://claude.ai/artifact/Ab6CepTiUzmQfngA4evcLU) on 2026-11-25.
- The model is `@cf/google/gemma-4-26b-a4b-it` on Workers AI, with thinking off. It answers only from `src/lib/site.ts`, `src/lib/faqs.ts` and `public/llms-full.txt`.
- When the model fails, or the free daily allowance of 10,000 neurons is spent, the chat gives the closest FAQ answer.
- The assistant is "Onyx", always labelled "Gigi's assistant · AI". It is a black character with only eyes and a fixed list of moods.
- It gives no prices, dates or promises. The prompt says so, and a server check replaces any reply that names an amount or a rate.
- No chat text is stored or logged. The logs get outcome codes only.
- Limits: same-site requests only, 8 KB body, 500 characters a message, 20 questions a chat, 8 messages a minute per address.

ADR-0030 is not superseded. Its rule-based assistant for lead demos is a different system.

## Consequences
- The free allowance gives about 140 to 230 model answers a day.
- One address can use up the day's allowance in about half an hour. After that everyone gets FAQ answers until 00:00 UTC. This is known and accepted; the fallback covers it.
- It is free only while the account stays on the Workers Free plan. On Workers Paid the same traffic would be billed.
- The site's Worker now has code, but only for `/api/*`. Pages are still static files.
- Preview builds do not inherit bindings, so they are repeated under `previews` in `wrangler.jsonc`. Previews use the real model, the same allowance and the same rate limit.
- The real model can only be tried on a Cloudflare build, through the browser on Gigi's computer: [[Test the site assistant]].


> 2026-11-27: the label and tone chosen here are replaced by [[ADR-0038 Onyx hosts the site in a confident voice and moves it only from allow-listed actions]]. The rest stands.
