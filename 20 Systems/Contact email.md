---
type: system
status: live
created: 2026-10-30
updated: 2026-11-09
tags: [system, email, cloudflare]
---
# Contact email

`hello@gigiberidze.com` forwards to Gigi's Gmail through **Cloudflare Email Routing**.

- Rule: `hello@` → Gigi's Gmail (Active, destination Verified). Catch-all is **off**.
- DNS: Cloudflare MX `route1/2/3.mx.cloudflare.net`, SPF, DKIM and DMARC. No other mail provider.
- On the site: `EMAIL` constant in `src/components/site/contact.tsx` (mailto link, no form).
- Receive only. Replying *as* hello@ would need a sending service (not set up).

See [[ADR-0006 Contact email through Cloudflare Email Routing]] and [[Add a contact address]].
