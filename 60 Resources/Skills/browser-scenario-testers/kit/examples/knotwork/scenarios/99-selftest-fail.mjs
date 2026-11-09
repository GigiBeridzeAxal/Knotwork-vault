import { openApp } from "./kw.mjs";
export default {
  name: "Self-test: a check that must fail",
  actors: ["alice", "bob"],
  async run({ actors: { alice, bob }, step, sees }) {
    await step(alice, "opens the app", () => openApp(alice));
    await step(bob, "expects a heading that does not exist", async () => { await openApp(bob); await sees(bob, "This text is not on the page", { timeout: 1500 }); });
    await step(alice, "never runs", () => openApp(alice));
  },
};
