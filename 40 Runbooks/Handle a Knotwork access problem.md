---
type: runbook
status: active
created: 2026-11-09
updated: 2026-11-09
tags: [runbook, knotwork, access]
---
# Handle a Knotwork access problem

For questions about who can get into what in [[Knotwork]], once PR #8 (teams, recovery codes, API keys) is live. Everything here is done in the app's Settings page; nothing needs a command.

## Someone should no longer be in a workspace
1. Owner: Settings > Members > **Remove**. They lose access on their next request and the API keys they made for it are deleted.
2. If they were an editor they have seen the webhook URLs. For each workflow they shouldn't be able to start: open it, and on the trigger press **New URL**. Update whatever calls the old URL.
3. The invite link they joined with is ended automatically. Revoke any other open link you no longer want used (Settings > Members > Open links).

## Someone can't get in with an invite link
- "Has run out": 10 people used it or the workspace has 10 members. Make a new link, or remove someone.
- "Doesn't work": it expired after 7 days, was revoked, or the workspace was deleted. Make a new link.
- Someone who was removed, left or was made a viewer: the link they joined with was ended. Send them a new link.
- The shared demo account can't join. They need their own account.

## Someone forgot their password
1. They open `/recover` (the "Forgot your password?" link on the login page) and enter their email, one recovery code and a new password.
2. Afterwards they make new recovery codes and new API keys in Settings (using one code ends the whole set, and the old keys ended).
3. No codes saved: the account can't be recovered. There is no email reset by design, see [[ADR-0013 Knotwork uses recovery codes instead of email resets]]. They sign up again with another email.

## A key or code may have leaked
- API key: Settings > API keys > **Revoke**, then make a new one.
- Recovery codes: Settings > Recovery codes > **Make new codes** (ends the old set).
- Password: changing it logs out other devices and ends all API keys and recovery codes. Make new codes afterwards.

## A script gets 401 or 403 with a key
- 401: the key was revoked, or the password was changed or recovered. Make a new key.
- 403 on a write: the key is read-only, or its maker is now a viewer.
- 403 on other routes: keys only reach workflows and runs. See `docs/api.md` in the repo.

Related: [[ADR-0012 Knotwork teams join by invite link and roles are read on every request]], [[ADR-0014 Knotwork API keys work in one workspace and never outrank their maker]]
