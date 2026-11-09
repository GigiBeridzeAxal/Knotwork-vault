---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook, knotwork]
system: "[[Knotwork]]"
---
# Set up a signed webhook in Knotwork

When to use this: a Knotwork workflow should start only on calls that really come from GitHub or Stripe. Needs knotwork PR #10 (phase 2) deployed.

1. **Pick a signing secret.** For GitHub, make up a long random value. For Stripe, it is given to you in step 3.
2. **Save it in Knotwork.** Settings, then Secrets. Name it in capitals, for example `GH_SIGNING`. The value can't be shown again; to change it, save it again.
3. **Tell the service.**
   - GitHub: the repository's Settings, then Webhooks, then Add webhook. Payload URL: the workflow's webhook URL (shown in the editor once the workflow is saved). Content type: `application/json`. Secret: the same value.
   - Stripe: Developers, then Webhooks, add an endpoint with the workflow's webhook URL. Copy its signing secret (it starts with `whsec_`, use the whole text) and save that in Knotwork.
4. **Turn the check on.** In the workflow's trigger, set "Check the sender's signature" to GitHub or Stripe, pick the secret, and save.
5. **Try it.** GitHub sends a `ping` as soon as the webhook is created, which starts a run. Stripe has "Send test webhook".

If it fails:
- **No run appears.** A refused call answers 401 and leaves nothing in Knotwork. Look at the webhook's Recent Deliveries on GitHub, or the event's delivery attempts in Stripe: the answer says why.
- **"signing secret isn't set".** The secret named in the trigger isn't in that workflow's workspace. Secrets belong to one workspace.
- **Signature doesn't match.** The value in Knotwork and in the service differ. Save it again in both; values are trimmed when saved.
- **Stripe: "too old".** The call was signed more than 5 minutes ago (a replay, or a very late retry).
- **`{{ trigger.body.… }}` is empty.** Open the run and look at its input to see the real field names.
- **Every secret stopped working at once.** `AUTH_PEPPER` changed; see [[ADR-0016 Knotwork secrets are encrypted with a key made from the pepper]]. Enter each secret again.

Related: [[Knotwork]], [[Knotwork system plan]]
