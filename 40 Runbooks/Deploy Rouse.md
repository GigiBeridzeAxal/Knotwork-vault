---
type: runbook
status: active
created: 2026-11-11
updated: 2026-11-14
tags: [runbook]
system: "[[Rouse]]"
---
# Deploy Rouse

Since 2026-11-11 Rouse deploys itself: every push to `main` of the private repo `GigiBeridzeAxal/rouse` is a production deploy, so it needs Gigi's go-ahead ([[Working agreements]]).

## Automatic (the normal way)
- Set up under Workers & Pages > rouse > Settings > Builds: production branch `main`, build `npm run build`, deploy `npx wrangler deploy`, root `/`, no build variables, preview builds on with `npx wrangler preview` (which is why `wrangler.jsonc` has an empty `"previews": {}` block, see [[Fix red preview build]]). It uses the existing "Workers Builds" API token.
- The Cloudflare GitHub app already had access to `rouse` when it was connected, so no GitHub change was needed.
- A build takes about 30 seconds. Check https://rouse.gigiberidze.com/api/health: `version` comes from `package.json`, `commit` from Cloudflare's `WORKERS_CI_COMMIT_SHA`. The first build (2026-11-11) answered `"commit":"main"`; builds from a push answer the short hash (`7cd821c76441` after PR #1, 2026-11-11).
- The custom domain `rouse.gigiberidze.com` comes from `routes` in `wrangler.jsonc`; Cloudflare made the DNS record and certificate on the first deploy. The workers.dev address is off.
- Cloud sessions can't reach the live site with curl (the proxy refuses it), but WebFetch can read it. Add a throwaway query such as `?v=<commit>`, because WebFetch caches each URL for 15 minutes.
- Pull requests get a Workers Builds comment with the build status, but Preview URLs are switched off for this Worker, so it says "No Preview URL". Turning them on is a Worker setting (Cloudflare docs: "Toggle Preview URLs").
- After a squash merge, restart the branch from `main`. Cloud sessions may refuse a force push; instead merge the old branch tip in (it has the same files as `main`) and push normally.
- First deploy: 2026-11-11, build `334398cb`, version `3befa06b`.

## Through Gigi's browser
On Gigi's devices Claude's permission mode may refuse the final **Deploy** click as a production deploy. With Gigi's message in the thread as approval it went through on the second try (2026-11-11); otherwise Gigi clicks it.

## Accounts on MongoDB Atlas
Since 2026-11-12, accounts live in MongoDB Atlas ([[ADR-0024 Rouse stores its data in MongoDB Atlas]]): the Atlas project "Rouse", the free M0 cluster `rouse` (Frankfurt), database `rouse`, user `rouse-worker` (readWrite on `rouse` only). The network access list allows 0.0.0.0/0, because Workers have no fixed IPs.

1. **Secrets.** Workers & Pages > rouse > Settings > Variables and Secrets > Add, type Secret:
   - `MONGODB_URI`: the connection string for `rouse-worker`.
   - `AUTH_PEPPER`: 32 or more random characters. Set it once and never change it: a new value makes every password and recovery code stop working.

   The values live in a `rouse-secrets` folder on Gigi's laptop desktop. Never write them anywhere else. Cloud agents can't paste them in (they aren't allowed to type secrets into forms).
2. **Indexes.** No step: the hub creates them on its first connection after each start.
3. **Check.** `/api/health` shows the commit. Then make Gigi's account first at `/signup`. Afterwards, look at the `rouse` Worker's Durable Objects metrics: Rouse's hub must stay well under 920 GB-s a day, because Knotwork's hub needs about 11,000 of the account's free 13,000.
4. **If accounts answer 503 "resting":** the hub used its 2 hours of connection time for the UTC day. It starts again after midnight UTC.
5. **Rollback.** Cloudflare can't roll back past the deploy that added the hub (`aef823e`).

## Notifications (from PR #10, once merged)
- Nothing to set. The hub makes the Web Push key pair on its first request and keeps it sealed in its own storage ([[ADR-0026 Rouse sends web push itself and the hub keeps the key]]). `GET /api/devices` (signed in) answers `pushKey`; `null` there means the key couldn't be made (no `AUTH_PEPPER`).
- Check on a phone: open Rouse from the home screen, sign in, Devices, "Turn on notifications on this iPhone", Allow, "Ring this iPhone", lock the phone. If nothing arrives, the device row says "Last push failed" with the push service's status code.
- If every device suddenly shows as failing or gone, the key pair changed (hub storage lost, or the pepper changed): each device taps "Turn on notifications" again.
- The service worker is `/sw.js`, served `no-cache`, so a new version is picked up on the next visit.

## If the log says "bad auth"
Seen 2026-11-12 and 13: the `rouse` Worker's log (Observability) showed `MongoPoolClearedError ... "bad auth : authentication failed"` and account routes answered 503. It means the password inside `MONGODB_URI` is not the one Atlas has for `rouse-worker`. The network rule and the user's role were fine. The fix is to set a new password in both places:

1. Atlas > project Rouse > Database Access > `rouse-worker` > Edit > Edit Password > Autogenerate Secure Password > Copy > Update User. An agent may click these in Gigi's browser; the password lands on that computer's clipboard and is never shown.
2. On the same computer, run `Rouse - connect database.cmd` (in the PC's Downloads folder; master copy in the project files under `rouse/connect-database/`). It reads the password from the clipboard, saves `MONGODB_URI` with Wrangler, then asks the live site to sign in with an account that doesn't exist: 401 means the database answers, 500 or 503 means it still doesn't. If the clipboard no longer holds a password, it makes a new one and asks for one paste in Atlas.
3. Agents can't do step 2: they aren't allowed to type or paste a password into a site or a secret store, even with Gigi's OK. So that double-click stays with Gigi.

Autogenerated Atlas passwords are letters and digits only, so they need no escaping in the connection string. After this, the old values in `rouse-secrets` on the laptop are out of date for `MONGODB_URI` (`AUTH_PEPPER` is unchanged).

The old D1 database `rouse` is unbound and unused. Delete it once Gigi agrees.

Secrets can't be set from a cloud session: there is no tool for it.
