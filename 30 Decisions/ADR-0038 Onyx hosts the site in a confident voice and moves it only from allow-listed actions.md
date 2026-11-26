---
type: decision
status: accepted
created: 2026-11-27
updated: 2026-11-27
date: 2026-11-27
tags: [decision, site, assistant]
supersedes:
superseded-by:
---
# ADR-0038 Onyx hosts the site in a confident voice and moves it only from allow-listed actions

## Context
On 2026-11-26 Gigi asked for more from Onyx on [[gigiberidze.com]]: more confident, talking "like me and not like assistant", aware that Gigi takes on any digital product (web, apps, software, motion graphics, branding), saying something in every section, joking, and able to take a visitor to the exact place on the site and point at it, "like he is showcasing website". Gigi approved the plan (https://claude.ai/artifact/AXfWGpq56Jmae5bE4vZFWv) with "no voice just emojis and text like how it is now but more active and clever", and approved the merge of gigiberidze.com PR #21 on a decision card.

This replaces two parts of [[ADR-0034 The site assistant answers from the site's facts on a free model]]: the label ("Gigi's assistant") and the reserved tone. Its facts, limits, safety rules and FAQ fallback stay. [[ADR-0035 Onyx speaks first from a script kept in the visitor's browser]] stays and is extended.

## Options considered
**Voice**
1. Onyx speaks as himself in Gigi's confident tone, labelled "Onyx · Gigi's AI" ("right hand").
2. Onyx speaks as Gigi in "I". Rejected: a visitor could take an AI's words for Gigi's own promise.
3. Keep the neutral assistant voice.

**How the chat moves the page**
1. The model returns free-form instructions or URLs. Rejected: a model or a crafted message could send a visitor anywhere.
2. Tool calls or a fixed answer form for Claude. Rejected for now: it changes the Claude request and the free model has no reliable tool calling.
3. One short marker line at the end of the answer, read and removed by the Worker and checked against fixed lists.

## Decision
Voice 1 and mechanism 3, built in gigiberidze.com PR #21 (squash `ecb0804`).
- **Voice:** short, direct, sure of the work, a dry joke now and then (a test caps jokes at a third of the lines). No audio: typed text and emoji only. He always says he is an AI and not Gigi; prices, dates and a yes come from Gigi by email. A new check next to the price check replaces model answers that promise a date or a result.
- **Knowledge:** the site, the FAQs, `llms.txt` and the prompt say that Gigi takes on any digital product. The proof named is Gigi's own work only; no client is invented.
- **Every section:** each section has a key (`data-onyx-section`) and its own lines. Most are small "asides" with their own pacing, never announced to screen readers and silenced by mute.
- **Show engine:** a fixed list of actions (show, point, open, tab, tour, link, stop) over a fixed registry of targets (section keys and `data-onyx-item` keys) and a fixed list of this site's routes. Never an external URL. He moves the page only after the visitor asks (a button, a chip, or a chat message that asks to see something). One move at a time; three page changes a minute at most; a move carried to another page is used once and expires in 10 seconds. Grey light and ring only; phones and reduced motion get the ring without the light.
- **Chat moves:** the model ends its answer with one marker such as `[[show:work.rouse]]`. The Worker strips every marker from the text, accepts only keys on the same lists the browser uses (one shared module, kept in sync by a test), and turns a move into a button when the visitor's own message did not ask to see something. Button labels are fixed by the server. Keyword rules do the same when no model answers. A restored chat never moves the page.

## Consequences
- The system prompt grew to about 22,400 characters (roughly 6,400 tokens), so each Claude answer costs a little more input; the estimate in [[ADR-0037 Onyx answers first with Claude Haiku 5.5, paid per use]] moves to about $0.25 to $1.30 per 1,000 answers.
- A new section or project card needs a key and lines; tests fail until it has them.
- Not checked: Safari, Firefox, real phones, screen readers, and how reliably Claude Haiku writes the marker (checked only with the free model on the preview).
- Open for Gigi: a proofread of the Georgian lines (now in the formal form), and the wording of the branding and motion graphics claims.
