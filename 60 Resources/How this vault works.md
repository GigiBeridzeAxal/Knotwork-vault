---
type: resource
created: 2026-11-09
updated: 2026-11-09
tags: [meta, help]
---
# How this vault works

A blend of the methods professionals use for technical vaults, kept simple enough to maintain.

| Idea | Borrowed from | Here |
|---|---|---|
| Sort by how actionable a note is | **PARA** (Tiago Forte) | Projects (finish line), Systems (ongoing areas), Resources, Archive |
| Numbered top folders that sort in a fixed order | **Johnny Decimal** | `00` to `99`, never more than ten top folders |
| Hub pages instead of deep folder trees | **Maps of Content** (Nick Milo) | [[Home]] links everything |
| Record why, not just what | **ADRs** (Michael Nygard) | `30 Decisions/`, immutable, superseded not edited |
| Write steps down once | SRE **runbooks** | `40 Runbooks/` |
| Typed notes with properties | **Dataview / Bases** | `type`, `status`, `created`, `updated` on every note; tables on Home use core **Bases** |
| Memory an AI can read | `CLAUDE.md` / agent memory vaults | [[CLAUDE.md]] + `50 Memory/` |

## Folders
| Folder | Put here |
|---|---|
| `00 Inbox` | Anything unsorted. Empty it weekly. |
| `10 Projects` | Work with a goal and an end. One folder per project. |
| `20 Systems` | Things that keep running: site, email, analytics, accounts. |
| `30 Decisions` | ADRs: one decision per note, numbered. |
| `40 Runbooks` | Step-by-step how-tos. |
| `50 Memory` | Facts about Gigi, rules for agents, environment, changelog, open questions. |
| `60 Resources` | Reference and help. |
| `70 Daily` | Daily notes (optional scratchpad). |
| `90 Archive` | Finished or dropped projects. Move, don't delete. |
| `99 Meta` | Templates, Bases, attachments. |

## Rules
1. **One subject per note**, and search before creating one.
2. **Link generously** with `[[wikilinks]]`. Links matter more than folders.
3. **Frontmatter on every note** (use the templates and it's automatic).
4. **No secrets.** Write where a secret lives, never its value.
5. **Decisions are append-only.** Change your mind with a new ADR.
6. When a project ends, set `status: done` and move it to `90 Archive`.

## Daily use
- New note from a template: command palette (`Ctrl+P`) > *Templates: Insert template*.
- Today's note: the calendar icon in the left ribbon (Daily notes).
- Quick switch: `Ctrl+O`. Search: `Ctrl+Shift+F`. Graph: `Ctrl+G`.

## Plugins
Only core plugins are needed (Templates, Daily notes, Bases, Properties, Backlinks, Outline, Graph, Bookmarks). Optional community plugins, if you want them later: **Obsidian Git** (sync to GitHub), **Templater** (smarter templates), **Dataview** (query language).
