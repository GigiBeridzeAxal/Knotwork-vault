---
type: decision
status: accepted
created: 2026-11-08
updated: 2026-11-09
date: 2026-11-08
tags: [decision]
supersedes:
superseded-by:
---
# ADR-0007 iPhone camera via Safari and WebRTC

## Context
Gigi wanted the iPhone 14 as an OBS camera but has no Mac, so a native iOS app isn't possible.

## Decision
A Node server on the PC serves a Safari page; the phone streams H.264 over WebRTC straight to an OBS Browser Source. LAN only, no STUN or TURN.

## Consequences
- Works without installing anything on the phone.
- Quality depends on the local network path (see [[Environment]]).

Related: [[iPhone OBS Cam]]
