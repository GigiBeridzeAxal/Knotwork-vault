import { api, logWorkflow, openApp, workspaceOf } from "./kw.mjs";

export default {
  name: "A workspace link lets a teammate work on the same workflows",
  tags: ["sharing", "propagation"],
  actors: ["alice", "bob", "carol"],
  async run({ actors: { alice, bob, carol }, step, check, sees, doesNotSee, eventually, runTag, data }) {
    const name = `${runTag} shared`;
    const renamed = `${runTag} renamed by bob`;
    await step(alice, "creates a workflow and copies her workspace link", async () => {
      await openApp(alice);
      const r = await api(alice, "POST", "/workflows", logWorkflow(name));
      check(r.status === 201, `create returned ${r.status}`);
      data.id = r.body.id;
      data.ws = await workspaceOf(alice);
    });
    await step(bob, "opens the link and sees alice's workflow", async () => {
      await bob.page.goto(`/workflows?workspace=${data.ws}`);
      await sees(bob, name);
      check(!bob.page.url().includes("workspace="), "the workspace id stays in the address bar after opening the link");
    });
    await step(bob, "renames it in the editor and saves", async () => {
      await bob.page.getByText(name).click();
      await bob.page.locator("#wf-name").fill(renamed);
      await bob.page.getByRole("button", { name: "Save" }).click();
      await sees(bob, "Saved");
    });
    await step(alice, "sees bob's new name after a reload", async () => {
      await eventually(async () => {
        await alice.page.reload();
        return (await alice.page.getByText(renamed).count()) > 0;
      }, { timeout: 10000, message: "alice never saw bob's rename" });
    });
    await step(bob, "the link is remembered: a fresh visit stays in alice's workspace", async () => {
      await bob.page.goto("/workflows");
      await sees(bob, renamed);
      check((await workspaceOf(bob)) === data.ws, "bob's browser did not keep alice's workspace");
    });
    await step(carol, "without the link sees neither name", async () => {
      await openApp(carol);
      await doesNotSee(carol, name);
      await doesNotSee(carol, renamed);
    });
    await step(alice, "cleans up", async () => api(alice, "DELETE", `/workflows/${data.id}`));
  },
};
