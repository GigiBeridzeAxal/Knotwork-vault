// Knotwork has no sign-in: each browser context gets its own workspace, so six contexts are six
// accounts. Point BST_BASE_URL at a local `npx vite` (default) or the live site.
export default {
  app: "Knotwork",
  baseURL: process.env.BST_BASE_URL ?? "http://localhost:5173",
  browsers: ["chromium", "firefox", "webkit"],
  // No `browser` on an actor = spread round-robin over the engines that launch. Pin one when the
  // scenario is about that engine (erin is the iPhone user, so WebKit).
  actors: [
    { name: "alice", role: "workspace owner" },
    { name: "bob", role: "teammate with alice's link" },
    { name: "carol", role: "stranger" },
    { name: "dave", role: "webhook caller (no UI)" },
    { name: "erin", role: "phone user", browser: "webkit", device: "iPhone 14" },
    { name: "frank", role: "heavy user (limits)" },
  ],
  scenarios: [
    "scenarios/01-isolation.mjs",
    "scenarios/02-shared-link.mjs",
    "scenarios/03-concurrent-edit.mjs",
    "scenarios/04-webhook.mjs",
    "scenarios/05-limits.mjs",
    "scenarios/06-phone-run.mjs",
  ],
  retries: 2,
  timeouts: { action: 10000, step: 30000, scenario: 180000 },
};
