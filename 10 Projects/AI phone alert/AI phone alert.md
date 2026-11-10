---
type: project
status: active
created: 2026-11-10
updated: 2026-11-10
tags: [project, cloudflare, portfolio, mcp]
repo: none yet
url:
stack: [Cloudflare Workers, D1, Durable Objects, KV, Hono, MCP, Web Push, React, Tailwind]
---
# AI phone alert

A pager for AI agents: an MCP server that lets Claude get Gigi's attention on the phone (quiet push, loud alarm, ringing call) when it is stuck, and carries the answer back so the work continues. Gigi's second portfolio project, asked for on 2026-11-10. **Working name: Rouse** ("Wake the human"); the name is not chosen yet.

## Status
Planning, 2026-11-10. Nothing is built or deployed, and no repo or account exists yet. Waiting on Gigi for the name and brand, the repo, which phone to wake, and whether any paid channel is wanted.

## How it works
The full design is in [[AI phone alert system plan]]. In short:
- Claude calls `alert_human` with a title, message, urgency and optional reply buttons.
- The service climbs a ladder (push, then alarm, then call) until Gigi answers, then stops on every channel.
- Claude reads the answer with `wait_for_reply`. Late answers are kept and read with `list_alerts`.
- One Cloudflare Worker on the free plan: [[ADR-0018 AI phone alert is one Worker with D1 and a timer object]].
- Free channels first, paid ones optional: [[ADR-0019 AI phone alert uses free channels first]].
- Links sent through outside services cannot answer an alert: [[ADR-0020 AI phone alert links from outside services cannot answer]].

## Brand
Three directions shown to Gigi on 2026-11-10 (private artifact https://claude.ai/artifact/T5TacpuwMciwf4QaJjdzN6, source `phone-alert/brand-directions.html` in the project files):
- **A. Rouse**: violet night and one dawn color, soft serif, a sunrise that reads as a bell. Recommended.
- **B. Holler**: warning-sign yellow and black, condensed capitals.
- **C. Beckon**: pager-display grey-green, dark ink, monospace, one signal dot.

All three share one signature: the ladder, three rising steps that light up as an alert climbs. None reuses Knotwork's ink and lime. A brand decision note follows Gigi's pick.

## Next
- [ ] Gigi picks the name and brand direction
- [ ] Gigi creates the GitHub repo (sessions can't create repos)
- [ ] Gigi says which phone to wake and whether Telegram is on it
- [ ] Gigi decides on paid parts (none, Pushover, Twilio)
- [ ] Phase 0: Worker, D1, CI, Workers Builds, subdomain, the three measurements

## Related
- Plan as a document (private to Gigi): https://claude.ai/artifact/5w5RtsHstt8PmzdjcBR1w2
- Self-review of the plan: `phone-alert/review-phone-alert-plan-2026-11-10.md` in the project files
- Precedents: [[Knotwork]], [[ADR-0003 Knotwork runs on the Cloudflare free plan]]
- Claude thread: *Plan AI phone alert app*
