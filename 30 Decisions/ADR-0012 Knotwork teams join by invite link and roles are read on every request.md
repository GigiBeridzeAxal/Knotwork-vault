---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork, security, teams]
supersedes:
superseded-by:
---
# ADR-0012 Knotwork teams join by invite link and roles are read on every request

## Context
Phase 5 of the [[Knotwork system plan]] lets several accounts work in one workspace. Knotwork sends no email (free plans only, [[ADR-0003 Knotwork runs on the Cloudflare free plan]]), so people can't be invited by address.

## Options considered
1. Invite by email address with a mailed link.
2. Invite links the owner copies and sends however they like.
3. Put the member's workspaces and roles in the session, like owned workspaces.
4. Read membership and role from the database on every request.

## Decision
Options 2 and 4.
- A workspace has one owner for good. Others join through a link as editor or viewer. Editors change workflows and start runs; viewers read and change nothing; only the owner manages people, links, the name and deletion. Personal workspaces can't be shared, and the demo account can't invite or join.
- A link is shown once and stored only as a hash. It works for 7 days or 10 people, lets each account in once (so a removed or demoted member can't walk back in with it), and is deleted when used up. A workspace holds 10 members and 5 open links.
- Role and membership are read from the `members` collection on every request, so a removal or role change applies on the member's next request. The dashboard picks the new role up within 30 seconds.
- Runs, limits and storage are always charged to the workspace's owner.
- Viewers and read-only API keys never get webhook URLs. After removing an editor the owner can make a new webhook URL per workflow.

## Consequences
- Members pay one extra database lookup per request (measured: one more round trip than an owner).
- Anyone holding an unused link can join until it expires or is revoked, so links should be sent privately.
- Ownership can't be handed over yet.
