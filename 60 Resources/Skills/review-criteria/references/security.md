# Security

**The question:** what can someone hostile, or just careless, do with this, and what would it cost?

A good security review is a short threat model plus a targeted hunt, not a generic checklist read aloud. Every finding needs an attack path: **who** the attacker is, **how** they reach the weakness, step by step, and **what** they get.

## Contents
- S0 Scope
- S1 Threat model
- S2 Checks by area (1 to 15)
- S3 Verify safely
- S4 Writing a security finding
- Security alerts for pre-existing problems
- Severity guide and score anchors

---

## S0 Scope

Every changed file counts, not only application code: config (`wrangler.*`, `vercel.json`, `_headers`, `next.config.*`, Dockerfiles), CI workflows, dependency manifests and lockfiles, infrastructure files, and docs (a public README can leak). In a project audit, the whole attack surface counts.

## S1 Threat model (write it in the report)

Five minutes, four lists:
- **Assets:** what is worth protecting. User data, other tenants' data, secrets and tokens, money and paid quotas, free-tier quotas (if exhausted, the app goes down), availability, the owner's machine and network, reputation.
- **Entry points:** every way input arrives. Routes and API endpoints, forms, URL and query params, headers and cookies, webhooks, file uploads, WebSockets, `postMessage`, scheduled jobs, CLI args, env and config files, data read from storage or third parties, LAN ports.
- **Trust boundaries:** where data crosses from less trusted to more trusted. Browser → server, user → user, workspace → workspace, server → third party, server → internal network, untrusted content → an AI model that can take actions.
- **Attackers:** anonymous internet user, signed-in user, another tenant, a malicious payload inside data (a workflow definition, a fetched web page, an uploaded file, an email, text sent to an LLM), someone on the same Wi-Fi, a compromised dependency, a careless operator.

Then hunt where the attackers meet the assets.

## S2 Checks by area

Check every area that applies; mark the others n/a in the report's coverage table.

**1. Authentication and sessions**
- Every non-public route checks identity on the server. Hiding a button is not access control.
- Session tokens are random, long, expire, and are invalidated on sign-out. Cookies have `HttpOnly`, `Secure`, `SameSite`.
- No credentials in URLs (they end up in logs, history and referrers). Password reset and magic links are single-use and expire.

**2. Authorization and tenant isolation**
- Every read and write is scoped to the caller: `WHERE owner = ?` on every query, not just the list view. Test by changing an id in the URL or body (IDOR).
- Workspace or tenant ids used as the only secret must be unguessable (at least 128 bits from a secure random source), never sequential or derived from public data.
- Check-then-act races (TOCTOU): permission checked, then the resource changed before the action.
- Admin and debug routes are not reachable by normal users or the public.

**3. Injection and unsafe input handling**
- **SQL:** parameterized queries only (`prepare(...).bind(...)`), never string-built SQL with user input. Watch dynamic `ORDER BY` and column names.
- **NoSQL:** operator injection from request bodies (`{"$gt": ""}`), unescaped user input in `$regex`.
- **Command:** no shell with user input (`exec`, `child_process` with `shell: true`, `os.system`). Use argument arrays.
- **Path traversal:** user input in file paths (`../`), archive extraction (zip slip).
- **XSS:** `dangerouslySetInnerHTML`, `innerHTML`, `v-html`, unescaped template output, `href` or `src` built from user input (`javascript:` URLs), Markdown or SVG rendered without sanitizing.
- **Template and expression injection:** user-controlled templates or expressions evaluated with `eval`, `new Function`, or a template engine that can reach globals.
- **Others:** header and CRLF injection, prototype pollution (deep-merging untrusted JSON, `__proto__` keys), unsafe deserialization, XML external entities, CSV formula injection in exports, regex built from user input.

**4. Outbound requests and SSRF**
When the server fetches a URL the user controls (HTTP steps, webhooks, link previews, image proxies, imports):
- Allow only `http`/`https`; block loopback, private, link-local and cloud metadata addresses, including after DNS resolution and redirects. Check what the platform blocks rather than assuming.
- Set timeouts and response size limits; don't forward the server's own credentials or cookies.
- Don't reflect full response bodies or internal error details back to the user.

**5. Code execution and sandboxing**
- User-supplied code, expressions, templates or scripts run in a real sandbox with no access to secrets, env or the network beyond what's intended.
- Hard limits on CPU time, steps, recursion depth, loop counts and memory. A loop in a user's workflow must not be able to run forever.

**6. Secrets and credentials**
- No secret in the repo or its history, in the client bundle, in logs, error messages, URLs, screenshots or docs.
- Client-exposed env prefixes (`VITE_`, `NEXT_PUBLIC_`, `PUBLIC_`, `REACT_APP_`) never hold secrets. Grep the built output too.
- Secrets live in the platform's secret store (for example `wrangler secret`, CI secrets) and the docs say *where*, never the value.
- Tokens have least privilege and a rotation path. A secret that was ever committed or shipped is leaked: removing it is not enough, it must be rotated (CRITICAL until rotated).

Quick scan of the change (adjust patterns to the stack):
```bash
git diff <base>...<head> | grep -nEi '(api[_-]?key|secret|token|passw(or)?d|bearer |private[_-]key|BEGIN [A-Z ]*PRIVATE KEY|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{20,}|sk_(live|test)_|xox[baprs]-|AIza[0-9A-Za-z_-]{35})'
git log -p --all -S 'BEGIN PRIVATE KEY' --oneline | head    # history, for audits
```
If `gitleaks` or `trufflehog` is available, prefer it.

**7. Data exposure and privacy**
- Responses return only the fields the client needs (no password hashes, internal ids, other users' emails).
- Errors don't leak stack traces, SQL, internal paths or hostnames to users.
- Logs and analytics carry no tokens, passwords or personal data.
- Public repos, public docs and public pages contain no personal data (personal emails, phone numbers, home address or exact location, account ids, machine names).
- Private responses aren't cached publicly (`Cache-Control: private` or `no-store`); CDN caching rules don't serve one user's data to another.
- CORS never reflects an arbitrary `Origin` together with credentials.

**8. Web platform hardening**
- Headers: a `Content-Security-Policy` (especially where user content is rendered), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `frame-ancestors` or `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. Check with `curl -sI <url>`.
- CSRF protection on state-changing routes that use cookie auth. No open redirects (`?next=` checked against an allowlist).
- Third-party scripts pinned to an exact version, with Subresource Integrity where possible. `postMessage` handlers check `event.origin`.
- Clipboard, camera, microphone and location are used only after a user action and only for what the feature needs.

**9. Abuse, denial of service and cost ("denial of wallet")**
- Rate limits on expensive or public endpoints (sign-up, email sending, anything that calls a paid API or writes to storage).
- Size limits on bodies, uploads, strings, arrays and nesting depth; pagination with a maximum page size; bounded loops, recursion and fan-out; timeouts on every outbound call.
- **Quotas:** on free or capped plans, a public route that writes to storage or sends email on every request can exhaust the daily quota and take the whole app down, or start a bill. Compare the worst-case per-request cost with the plan's limits.
- Regular expressions on user input have no catastrophic backtracking (nested quantifiers like `(a+)+`).

**10. Dependencies and supply chain**
- Each new dependency is needed, maintained, widely used and spelled right (typosquats). The lockfile is committed and matches the manifest.
- Run the ecosystem's audit (`npm audit --omit=dev`, `pip-audit`, `cargo audit`) and report known vulnerabilities on reachable code paths.
- Watch install scripts (`postinstall`) in new packages.
- CI: actions pinned to a commit SHA or a trusted major tag, minimal `permissions:`, no `pull_request_target` that checks out and runs untrusted PR code, secrets never echoed.

**11. Infrastructure and configuration**
- Debug modes, verbose errors and dev routes are off in production. Source maps are not public unless intended.
- Preview or staging builds can't write to production data. API tokens and service bindings have least privilege.
- Storage buckets aren't public by accident. Email domains have SPF, DKIM and DMARC where email is sent.

**12. Local and LAN services**
- Bind address: `127.0.0.1` unless other devices must connect; if `0.0.0.0`, assume everyone on the network can reach it.
- A pairing code or token for anything that controls a camera, microphone, files or the machine. Nothing exposed through tunnels or port forwarding by accident.
- Self-signed TLS: what it protects and what it doesn't. WebRTC: which servers are used and what addresses are exposed.

**13. Cryptography and randomness**
- Ids and tokens from a secure source (`crypto.randomUUID`, `crypto.getRandomValues`, `secrets`), never `Math.random`.
- Passwords hashed with argon2, bcrypt, scrypt or PBKDF2 with a real cost; never plain SHA or MD5.
- Signatures and secrets compared in constant time. Webhook signatures verified. JWTs: signature, algorithm, expiry and audience verified; `alg: none` rejected.

**14. AI and LLM features**
- Untrusted content (web pages, emails, documents, user text) that reaches a model with tools can't trigger actions on its own (prompt injection).
- Model output is treated as untrusted: escaped when rendered, never executed or used as SQL or shell.
- No secrets in prompts. Per-user and global limits on paid calls.

**15. File uploads and downloads**
- Type and size checked on the server (by content, not just extension). Stored outside the web root with random names. Served with `Content-Disposition` and the right `Content-Type`. Image and archive processing protected against decompression bombs.

## S3 Verify safely

Try to break it, but only where it's safe:
- Use local, dev or preview instances. Never probe, scan or exploit production or third-party systems, and never run anything destructive.
- Craft the request with `curl` (change an id, drop the auth header, send an oversized body, send `{"$gt":""}`), write a failing test, grep the built bundle for secrets, read the response headers.
- A defense you confirmed by a test or a tried attack makes the finding (or its absence) CONFIRMED. Reading alone is PLAUSIBLE.

## S4 Writing a security finding

Use the finding format from SKILL.md and add:
- **Attacker:** who (anonymous, signed-in user, other tenant, someone on the LAN).
- **Path:** how they reach it, step by step.
- **Impact:** what they get (whose data, what action, what cost).
- **Fix:** the code change, and the test that proves it.

If a secret is involved: file, line, kind of secret, the value masked (first 4 characters then `...`), and "rotate it".

## Security alerts for pre-existing problems

In a change review, a CRITICAL or HIGH security problem found in untouched code still goes at the top of the report as an **alert**, because it needs action regardless of this change. It counts toward this change's rating only if the change touches, exposes or worsens it.

---

## Severity guide

| Level | Security examples |
|---|---|
| **CRITICAL** | An anonymous attacker gets code execution, secrets, admin, or all users' data; authentication bypass; a live secret committed or shipped to clients; anyone can take the service down or run up cost cheaply. |
| **HIGH** | A signed-in user or another tenant reaches someone else's data or actions (IDOR); stored or reflected XSS on a real page; SSRF to internal or metadata addresses; injection with a real path; a state-changing route with no auth; personal data published in a public repo or page. |
| **MEDIUM** | Exploitable only under unusual conditions or with limited impact; a missing rate or size limit on a moderately costly public route; CSRF on a low-impact action; errors leaking internals; a known-vulnerable dependency on a reachable path with limited impact; missing CSP where user content is rendered. |
| **LOW** | Hardening with no concrete path: headers on a static page, minor version disclosure, `rel="noopener"`, defense in depth. |

## Score anchors

| Score | What it looks like |
|---|---|
| **10** | Threat model written; every entry point the work adds or touches checked; no findings above trivial; the key defenses proven by a test or a tried attack. |
| **9** | No MEDIUM or worse; one or two LOW hardening notes; defenses verified. |
| **8** | No MEDIUM or worse, a few LOW notes; or clean, but from reading only. |
| **7** | One MEDIUM. |
| **6** | Several MEDIUMs, or one MEDIUM with wide reach. |
| **4-5** | One HIGH. 3 with several, or one with wide reach. |
| **1-2** | A CRITICAL. |
| **0** | A CRITICAL that is already exploitable in production or a secret already public. |
