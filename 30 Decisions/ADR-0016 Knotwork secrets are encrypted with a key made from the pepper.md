---
type: decision
status: accepted
created: 2026-11-09
updated: 2026-11-09
date: 2026-11-09
tags: [decision, knotwork, security]
supersedes:
superseded-by:
---
# ADR-0016 Knotwork secrets are encrypted with a key made from the pepper

## Context
Phase 2 of the [[Knotwork system plan]] lets a workspace store API keys and use them in steps as `{{ secrets.NAME }}`, and lets a webhook check the sender's signature with a stored secret. The values must not be readable in the database, in the workflow, in logs or in the dashboard. Gigi should not have to run a command or set anything new to turn this on.

## Options considered
1. **A new Worker secret as the encryption key.** Clean separation, but one more value to create, set and keep safe by hand.
2. **Derive the key from the existing `AUTH_PEPPER` Worker secret**, one key per workspace. Chosen.
3. **Cloudflare Secrets Store or KV.** More moving parts, and limits that don't fit a per-workspace list on the free plan.

## Decision
- **Storage.** Collection `secrets` in [[MongoDB Atlas]], id `<workspace id>:<NAME>`. Only the encrypted value, the name and dates are stored.
- **Encryption.** AES-256-GCM with a random 12-byte IV per save. The key comes from `AUTH_PEPPER` through HKDF-SHA-256 with the workspace id as salt, so each workspace has its own key. The workspace id and secret name are bound into the ciphertext, so a stored value can't be copied to another name or workspace and still open.
- **Write-only.** The API lists names and dates and never returns a value. To change a secret, save it again.
- **Rules.** Names are capitals, digits and underscores (up to 40 characters); values 8 to 4000 characters; 20 secrets per workspace. The demo account can't store secrets.
- **Use in a run.** Only the secrets a workflow mentions are loaded and opened. A missing secret fails the step with a message that says where to add it.
- **Never shown, in two layers.** What a step says about itself (the address it called, the two sides of a condition) is written from a copy of the data where each secret is already its mark, `[secret NAME]`, so cutting or parsing the text can't leave part of one. On top of that, every output, log line and error passes through one redactor that replaces a secret's value (plain, JSON-escaped, URL-encoded, trimmed, and for a web address also without its scheme or as its path alone) before it is stored or handed to later steps. The first layer was added in review: a chat webhook URL kept as a secret had been logged as host and path, which the redactor alone didn't recognise.
- **Redirects.** When a service redirects to another site, headers and bodies filled in from a secret are not sent on.
- **Values are trimmed when saved.**
- **Signed webhooks.** A webhook trigger can name a provider (GitHub or Stripe) and a secret. The Worker checks the HMAC-SHA-256 signature over the raw body, in constant time; Stripe timestamps older than 5 minutes are refused. A failed check answers 401, starts no run and uses no run allowance. GitHub's default form-encoded delivery is accepted too: its `payload` field is unwrapped.

## Consequences
- Nothing new to set up: the feature works as soon as the code is deployed.
- **Changing `AUTH_PEPPER` makes every stored secret unreadable** (and signs everyone out, as before). After a pepper change, secrets must be entered again. Where the pepper lives: the Worker's secrets in [[Cloudflare]]; see [[Deploy Knotwork]].
- A workflow's author can still send a secret wherever a step sends data; that is what secrets are for. Redaction protects logs and screens, not the destination.
- The trigger's own input (the webhook body and headers) is stored as received and is not redacted. Callers should sign their calls, not send a shared token in a header.
- GitHub's signature carries no time, so a captured call can be replayed until the secret is changed. Stripe's is refused after 5 minutes.
- Deleting a workspace or an account deletes its secrets.

## Added in review (2026-11-09, same decision, more detail)
- **In a team.** The owner and editors add, replace and delete secrets; viewers see names only; an API key can't list or change them. A secret is stored under the workspace's owner whoever saved it, so it goes with the workspace or the owner's account, not with the member.
- **Editing rights are reading rights.** Anyone who can edit a workflow (an editor, a write API key) can send a secret's value to an address of their own. After removing an editor or revoking a write key, replace the secrets they could use.
- **More shapes are hidden.** For a secret that is a web address, its path, its query and each query value, user name or password of 8 characters or more are hidden too, in the forms a URL parser writes them. Also hidden: query values as written, path pieces of 8 characters or more, JSON text with `\/`, and a value whose `+` came back as a space.
- **Redirects, exactly.** On a redirect to another site, headers filled in from a secret are dropped, and a request whose body holds a secret fails instead of being sent on.
- **A secret that can't be opened** (the pepper changed) fails the step with "is saved but can't be read any more", and a signed webhook answers 401 until the secret is saved again.

Related: [[Knotwork]], [[Knotwork system plan]], [[ADR-0008 Knotwork has accounts and stores data in MongoDB Atlas]]
