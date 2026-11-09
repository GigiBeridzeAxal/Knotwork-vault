import { api, logWorkflow, openApp, workspaceOf } from "./kw.mjs";

export default {
  name: "Two people saving the same workflow at once leave it whole",
  tags: ["concurrency"],
  actors: ["alice", "bob"],
  async run({ actors: { alice, bob }, step, together, check, sees, runTag, data, note }) {
    await step(alice, "creates a workflow and shares it with bob", async () => {
      await openApp(alice);
      data.id = (await api(alice, "POST", "/workflows", logWorkflow(`${runTag} race`))).body.id;
      data.ws = await workspaceOf(alice);
      await bob.page.goto(`/workflows?workspace=${data.ws}`);
    });
    await together(
      step(alice, "opens the editor", () => alice.page.goto(`/workflows/${data.id}`)),
      step(bob, "opens the editor", () => bob.page.goto(`/workflows/${data.id}`)),
    );
    await together(
      step(alice, "renames to A", () => alice.page.locator("#wf-name").fill(`${runTag} A`)),
      step(bob, "renames to B", () => bob.page.locator("#wf-name").fill(`${runTag} B`)),
    );
    await together(
      step(alice, "saves at the same moment", async () => {
        await alice.page.getByRole("button", { name: "Save" }).click();
        await sees(alice, "Saved");
      }),
      step(bob, "saves at the same moment", async () => {
        await bob.page.getByRole("button", { name: "Save" }).click();
        await sees(bob, "Saved");
      }),
    );
    await step(alice, "the stored workflow is one of the two versions, not a mix, and there is still one copy", async () => {
      const wf = (await api(alice, "GET", `/workflows/${data.id}`)).body;
      check([`${runTag} A`, `${runTag} B`].includes(wf.name), `unexpected name after the race: ${wf.name}`);
      check(wf.steps.length === 1, `steps changed in the race: ${wf.steps.length}`);
      const list = (await api(alice, "GET", "/workflows")).body.filter((w) => w.name.startsWith(runTag));
      check(list.length === 1, `expected 1 workflow, found ${list.length}`);
      note(`last write won: "${wf.name}". Knotwork has no conflict warning; the other person's edit is silently lost.`);
    });
    await step(alice, "cleans up", async () => api(alice, "DELETE", `/workflows/${data.id}`));
  },
};
