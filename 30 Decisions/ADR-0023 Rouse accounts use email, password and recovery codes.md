---
type: decision
status: accepted
created: 2026-11-12
updated: 2026-11-12
date: 2026-11-12
tags: [decision, security, rouse]
supersedes:
superseded-by:
---
# ADR-0023 Rouse accounts use email, password and recovery codes

## Context
On 2026-11-12 Gigi asked for sign-up and sign-in on [[Rouse]] ("i need auth system as well to setup it and sign in / sign up"). The [[Rouse system plan]] had only "Gigi signs in with a passkey" and left accounts for other people to phase 4. Read as: anyone can make an account, and each account's alerts reach only its own phone.

Constraints: the Cloudflare free plan gives a request about 10 ms of CPU; Rouse sends no email (no mail service, no funds); the site is a public portfolio piece, so visitors should be able to try it on any device.

## Options considered
1. **Passkeys** (Face ID, Touch ID, a security key): no password to steal, but a lost device needs a second way back in, and some visitors' browsers or managed machines can't make one.
2. **Email and password**, with one-time recovery codes for a forgotten password, since no email is sent.
3. **A link sent by email**: needs a mail-sending service Rouse doesn't have.
4. **Sign in with GitHub or Google**: depends on an outside app registration, and a visitor without those accounts can't try Rouse.

## Decision
Gigi chose **email and password** on 2026-11-12. Built in [PR #3](https://github.com/GigiBeridzeAxal/rouse/pull/3):
- Passwords of 10 to 200 characters, no other composition rules, checked against Have I Been Pwned's breach list (only five characters of the SHA-1 leave Rouse, the answer is padded, and the check lets the password through if the service is down).
- Stored as PBKDF2-SHA-256 with 10,000 rounds over an HMAC with a Worker secret (the pepper), the same scheme as [[Knotwork]]. The rounds are low for the CPU limit; the pepper never enters the database, and each hash records its own round count so it can rise later.
- At most one slow hash per request, so changing the password, making new codes and deleting the account first confirm the password (valid 10 minutes in that browser).
- Ten recovery codes at sign-up, as in [[ADR-0013 Knotwork uses recovery codes instead of email resets]]: 60 random bits each, stored as an HMAC tied to the account, each works once, and a reset signs every browser out.
- 10 wrong passwords in a row lock the account for 15 minutes; a recovery code still works.
- Sessions in a `__Host-` cookie with only the token's hash stored; 30 days, renewed while used.

## Consequences
- Works on every browser and with password managers, needs no outside service, and fits the CPU limit (about 2 ms per sign-in and 4 ms per sign-up when measured in Node).
- Addresses aren't verified: anyone can take any address as an account name, and sign-up says when one is taken. Gigi should make the first account with their own address.
- Someone who knows an address can keep that account locked for 15 minutes at a time; signed-in browsers are not affected.
- If a password and every recovery code are lost, the account can't be recovered; there is no support path.
- If the database and the pepper leak together, weak passwords fall quickly; the length rule and the breach check limit that.
- Passkeys can be added later as a second way in without changing this.
