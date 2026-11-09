---
type: memory
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [memory, rules]
---
# Working agreements

What agents may do on their own, and what needs Gigi's OK first.

## Allowed without asking
- Push and squash-merge their own PRs on **gigiberidze.com** after building and testing (Gigi, 2026-10-30: "give all of that agents perms to push and merge it to deploy"). Then tell Gigi it's live.
- Update this vault.

## Ask first
- Anything outside the repo: DNS, Cloudflare settings, Email Routing, sending email.
- Payments, sign-ups and legal filings. Personal details always come from Gigi.
- Creating paid resources of any kind.

## Facts that shape how to work
- Claude sessions can't create GitHub repos. Gigi creates them.
- Claude desktop auto mode on Gigi's PC blocks npm and npx; switch to Ask permissions for those steps.
- Cloud sessions can't reach gigiberidze.com or the Cloudflare dashboard. Use Gigi's Chrome.
