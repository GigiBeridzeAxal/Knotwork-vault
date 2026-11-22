---
type: system
status: live
created: 2026-10-30
updated: 2026-11-22
tags: [system, email, cloudflare]
---
# Contact email

`hello@gigiberidze.com` forwards to Gigi's Gmail through **Cloudflare Email Routing**.

- Rule: `hello@` → Gigi's Gmail (Active, destination Verified). Catch-all is **off**.
- DNS: Cloudflare MX `route1/2/3.mx.cloudflare.net`, SPF, DKIM and DMARC. No other mail provider.
- On the site: `EMAIL` constant in `src/components/site/contact.tsx` (mailto link, no form).
- Receive only. Replying *as* hello@ would need a sending service (not set up).

## Checking for new mail
- Gmail search `in:anywhere to:hello@gigiberidze.com` in Gigi's Gmail (forwarded mail keeps the original To).
- Cloudflare dashboard > Email Routing > **Activity log** (pick *Last 30 days*) also shows mail that was *rejected* and never reached Gmail, e.g. sender failed SPF/DKIM (`Unauthenticated`).
- 2026-11-18 check: nothing ever delivered; one spoofed "email address verification" mail rejected as Unauthenticated (2026-11-06).
- 2026-11-18 live test: a mail from Gigi's second Gmail reached the main Gmail within a minute, but **landed in Spam**. Search with `in:anywhere` (or `in:spam`). Fix offered: a Gmail filter `to:hello@gigiberidze.com` → *Never send it to Spam*.

## Phone ping (2026-11-22, in progress)
Planned: the hello@ rule sends mail to the Rouse Worker, which forwards it to Gmail and pings the iPhone. See [[ADR-0032 hello@ mail goes through the Rouse Worker]] (rouse PR #14). Until the rule is switched, routing is still hello@ → Gmail.

See [[ADR-0006 Contact email through Cloudflare Email Routing]] and [[Add a contact address]].
