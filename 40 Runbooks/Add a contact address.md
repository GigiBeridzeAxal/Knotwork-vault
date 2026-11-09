---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook]
system: "[[Contact email]]"
---
# Add a contact address


To add another address such as `work@gigiberidze.com`:

1. Cloudflare > gigiberidze.com > Email > Email Routing > Routing rules > Create address.
2. Pick the destination (Gmail is already verified).
3. No code change unless the address shown on the site changes (`EMAIL` in `src/components/site/contact.tsx`).

Ask Gigi before changing anything in Cloudflare.

