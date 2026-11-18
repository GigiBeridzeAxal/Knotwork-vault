---
type: runbook
status: active
created: 2026-11-19
updated: 2026-11-19
---
# Claude Platform agents

Managed agents on platform.claude.com (Gigi's workspace "Default").

## GitHub writes fail with 403 "Resource not accessible by integration"
The agent's GitHub access comes from a credential vault entry (MCP OAuth to GitHub's hosted MCP server). That sign-in goes through the GitHub App **Claude Github MCP Connector**. Authorizing it is not enough: the app must also be **installed** on the account, with the repo selected.
1. Open github.com/apps/claude-github-mcp-connector, click Install, pick the account.
2. Choose "Only select repositories" and add the repo (least access), then Install & Authorize.
3. Check at GitHub Settings > Applications > Installed GitHub Apps.
4. Tell the agent to try again. No reconnect of the vault credential was needed.

Limits: the app has read and write for code, issues and pull requests, but **no workflows permission**, so files under `.github/workflows/` are refused. Add those in the GitHub web editor or with a normal git push.

## Cost tip
The agent re-reads every project file before each push attempt (about 40K tokens). Ask for one `push_files` commit instead of file-by-file retries.
