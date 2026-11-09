# Documentation

**The question:** can the next person (a new developer, the operator, a user, the author six months from now, or an AI agent) understand, use, run, change and operate this without asking the author?

Good documentation is **needed** (each audience has what it needs), **accurate** (it matches the code, verified by running it), **current** (updated with this change), **findable** (linked from where people look) and **safe** (no secrets or private data).

## Contents
- D0 Audiences
- D1 Inventory
- D2 What this work requires
- D3 Accuracy: verify, don't trust
- D4 Quality
- D5 Code-level documentation
- D6 Safety
- Severity guide and score anchors

---

## D0 Audiences

| Audience | Needs |
|---|---|
| **Users** | How to use it; on-screen help and labels; error messages that say what happened and what to do; release notes for changes they'll notice |
| **Developers** | What it is, how to set it up, run, test and build it; the architecture in a paragraph or a diagram; conventions; where things live |
| **Operators** | How to deploy and roll back; every config value, env var and secret (where it's set, never its value); monitoring; runbooks for routine and emergency tasks |
| **Decision readers** | *Why* it is built this way: decision records with context, options considered, the choice and its consequences |
| **AI agents** | `CLAUDE.md` / `AGENTS.md`: commands, conventions, gotchas, what not to touch |

## D1 Inventory

Find every doc that exists: `README`, `docs/`, `CHANGELOG`, decision records (ADRs), runbooks, API docs or an OpenAPI file, `.env.example`, `CLAUDE.md` or `AGENTS.md`, code comments and docstrings, in-app help and copy, and any project knowledge base (an Obsidian vault, a wiki, a Notion space). Record them in the report's inventory table: doc, audience, needed for this work, exists, accurate, current.

If the project keeps a knowledge base with its own rules (for example a vault whose `CLAUDE.md` says to update a system note, add a changelog line and bump an `updated:` date), read those rules and check this work followed them.

## D2 What this work requires

In a change review, each kind of change calls for a kind of doc:

| The change adds or changes | It needs |
|---|---|
| A user-facing behaviour | User docs or help text; a changelog or release-notes line |
| A command, script, dependency or system requirement | README setup and run steps |
| An env var, secret, binding or config value | Its name, purpose, where it's set, default and an example, in the README or config docs and `.env.example` (placeholder values only) |
| An API endpoint, schema or payload | Request, response, errors, auth and limits, with an example |
| A breaking change | Migration notes and a changelog entry |
| A non-obvious choice between options | A decision record (context, options, decision, consequences) |
| A new operational procedure (deploy, migrate, rotate, restore) | A runbook with exact steps |
| Tricky or surprising code | A comment explaining *why* (the constraint, the bug it avoids), not *what* |
| A public function, module or component, where the codebase documents them | A docstring or typed signature matching the house style |
| Anything the project's knowledge-base rules cover | The updates those rules ask for |

**"No docs needed" is a valid result** when it's true: an internal refactor with no behaviour change may need only a clear commit message. Say why.

## D3 Accuracy: verify, don't trust

Stale docs are worse than none, because people follow them.
- **Run the documented steps.** From a fresh clone if you can: install, build, test, run, deploy to a dry-run target. Every command in the docs should work as written.
- **Check every name.** Paths, file names, script names, env vars, URLs, ports and flags mentioned in docs exist. Grep both ways: every env var the code reads is documented, and every documented env var is read by the code.
  ```bash
  grep -rhoE 'process\.env\.[A-Z0-9_]+|import\.meta\.env\.[A-Z0-9_]+|env\.[A-Z][A-Z0-9_]+' src worker app 2>/dev/null | sort -u
  ```
- **Compare shapes.** Documented API requests and responses, defaults, limits and examples match the code.
- **Check links** (internal and external) and that screenshots show the current UI.

## D4 Quality

- **Findable:** linked from the README, the docs index or the knowledge base's home page. A doc nobody can find doesn't exist.
- **Scannable:** headings, short sections, tables for config and options, the most common task first.
- **Concrete:** copy-paste commands, real-looking example values, expected output.
- **One source of truth:** a fact lives in one place and others link to it; duplicated facts drift.
- **The right kind of doc for the job:** a tutorial teaches, a how-to or runbook gets a task done, a reference lists facts, an explanation or decision record gives the why. Don't bury a runbook in an explanation.
- **Absolute dates** ("2026-11-09", not "last week"), consistent terms that match the UI and the code, plain language for the audience.

## D5 Code-level documentation

- Comments explain why, constraints and gotchas; they don't narrate obvious code.
- No stale or misleading comments, no commented-out code, no `TODO` without context (who, which issue).
- Names, types and signatures are clear enough that most functions need no comment.
- Error messages and logs are actionable: what happened, the relevant id, what to do next.

## D6 Safety

Docs, comments, examples and screenshots contain no secrets, tokens, passwords, API keys, account ids, personal emails, phone numbers, home addresses, exact locations or machine names, especially in public repos. Write *where* something sensitive lives, never its value. File any violation under Security (it's a leak) and cross-reference it here.

---

## Severity guide

| Level | Documentation examples |
|---|---|
| **CRITICAL** | Docs instruct a destructive action as if routine (a command that wipes production data); work others must operate has no documentation at all. (Secrets or private data in docs are filed under Security and cross-referenced here.) |
| **HIGH** | Docs are wrong in a way that makes someone fail on a main path (setup or deploy steps don't work, the documented API differs from the code); a new user-facing feature, breaking change or required secret or config has no docs, so only the author can run or deploy it. |
| **MEDIUM** | A needed doc missing or stale on a secondary path; a new env var, script or command not in the README; the changelog or knowledge base not updated as the project's rules require; a decision not recorded; tricky code without a why-comment; a minor breaking change without a migration note. |
| **LOW** | Typos, formatting, a missing example, a link that would help, wording. |

## Score anchors

| Score | What it looks like |
|---|---|
| **10** | Every audience served; the documented steps were run and work; accurate, current and findable; decisions recorded; the project's doc rules followed; nothing unsafe. |
| **9** | As 10, with one or two LOW gaps. |
| **8** | Complete and accurate with LOW gaps only; or complete but not verified by running. |
| **7** | One MEDIUM: one needed doc missing or stale on a secondary path, or the changelog or knowledge base not updated. |
| **6** | Several MEDIUMs. |
| **4-5** | One HIGH: wrong setup or deploy steps, or a key feature, config or breaking change undocumented. 3 with several. |
| **1-2** | A CRITICAL: a destructive instruction, or work others must operate with no docs. (A leaked secret is scored under Security.) |
| **0** | Docs that would cause serious damage if followed. |
