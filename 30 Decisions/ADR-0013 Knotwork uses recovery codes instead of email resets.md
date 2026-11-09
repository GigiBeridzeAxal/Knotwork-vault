---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork, security, accounts]
supersedes:
superseded-by:
---
# ADR-0013 Knotwork uses recovery codes instead of email resets

## Context
A forgotten password needs a way back in, and Knotwork sends no email ([[ADR-0003 Knotwork runs on the Cloudflare free plan]]).

## Options considered
1. Email reset links through a mail service (needs a sender domain, a provider and its limits).
2. One-time recovery codes the user saves when they choose to.
3. No recovery at all.

## Decision
Option 2. An account can make 8 codes (password needed). Each is 12 characters with 60 random bits, shown once, and stored only as a keyed hash (keyed with the `AUTH_PEPPER` secret). A code plus the email sets a new password once; the same database update that sets the password ends the whole set (someone else may hold a copy of the sheet), so the user makes new codes afterwards. Recovering signs out every device and ends the account's API keys. Changing the password in Settings does the same and also ends the remaining codes. Wrong codes are limited to 10 per email and network per 15 minutes, and the answer is the same for a wrong code and an unknown email.

## Consequences
- No mail provider, no cost, nothing to configure.
- An account with no saved codes and a lost password can't be recovered. The home page reminds people who have none.
- After a password change the user has to make new codes.
