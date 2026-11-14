---
type: runbook
status: active
created: 2026-11-14
updated: 2026-11-14
tags: [runbook, rouse, mcp]
system: "[[Rouse]]"
---
# Connect Claude to Rouse

Lets a Claude raise alerts on a Rouse account and read the answers. The address is `https://rouse.gigiberidze.com/mcp`. Why it works this way: [[ADR-0027 Claude signs in to Rouse with OAuth and one alert tool]].

## Claude app and Claude.ai
1. Settings > Connectors > Add custom connector.
2. Name `Rouse`, address `https://rouse.gigiberidze.com/mcp`. Leave the advanced fields empty.
3. Press Connect. Rouse opens: sign in if asked, check the account shown, press **Allow**.
4. In a chat, turn the Rouse connector on and ask: "Use Rouse to ask me something."

One connector serves the web, desktop and phone apps of that Claude account.

## Claude Code
1. Run once: `claude mcp add --transport http rouse https://rouse.gigiberidze.com/mcp` (add `--scope user` to have it in every folder).
2. In Claude Code type `/mcp`, choose rouse, and sign in. The browser opens Rouse: press **Allow**.

## Check it
- Rouse > Agents lists the Claude, with when it was last used and its alerts this hour.
- A test alert shows on Rouse > Home with its answer buttons; answering it returns the answer to Claude within about 5 seconds.

## Cut one off
Rouse > Agents > Disconnect. Its keys stop on the next call and anything it is ringing stops. Connecting again asks for Allow again.

## When it fails
- **"This sign-in can't continue"**: the page says why. Remove Rouse in Claude and add it again.
- **Claude says it needs to sign in again after a long break**: the refresh key lasts 90 days from last use. Connect again.
- **Tools answer "resting"**: the hub used its 2 hours of database time for the UTC day ([[ADR-0024 Rouse stores its data in MongoDB Atlas]]). It returns at midnight UTC.
- **Claude says an alert was not sent**: that Claude raised 30 alerts in an hour, or the account got 100 in a day. It says when to try again.
- **An alert shows in the app but the phone stays silent**: the phone isn't paired, or pairing isn't built yet ([[Rouse pairing and calls plan]]).
