import { api, createInUi, openApp } from "./kw.mjs";

export default {
  name: "Workspaces are private to each browser",
  tags: ["isolation", "security"],
  actors: ["alice", "carol"],
  expectedHttp: [404],
  async run({ actors: { alice, carol }, step, check, sees, doesNotSee, runTag, data, leftBehind }) {
    const name = `${runTag} alice private`;
    await step(alice, "creates a workflow in the UI", async () => {
      data.id = await createInUi(alice, name);
      data.cleaned = leftBehind(`Knotwork workflow ${data.id} "${name}" in alice's workspace`);
    });
    await step(alice, "sees it in her list", async () => {
      await openApp(alice);
      await sees(alice, name);
    });
    await step(carol, "does not see it in her own list", async () => {
      await openApp(carol);
      await doesNotSee(carol, name);
    });
    await step(carol, "opening alice's workflow URL directly shows nothing of it", async () => {
      await carol.page.goto(`/workflows/${data.id}`);
      await sees(carol, "No workflow with that id");
      await doesNotSee(carol, name);
    });
    await step(carol, "the API refuses alice's workflow and runs to carol", async () => {
      const wf = await api(carol, "GET", `/workflows/${data.id}`);
      check(wf.status === 404, `GET /workflows/:id returned ${wf.status}, expected 404`);
      const del = await api(carol, "DELETE", `/workflows/${data.id}`);
      check(del.status === 404, `carol could DELETE alice's workflow (status ${del.status})`);
    });
    await step(alice, "still has it after carol's attempts, then cleans up", async () => {
      const wf = await api(alice, "GET", `/workflows/${data.id}`);
      check(wf.status === 200 && wf.body.name === name, `alice's workflow changed or vanished: ${wf.status}`);
      const del = await api(alice, "DELETE", `/workflows/${data.id}`);
      if (del.status === 204) data.cleaned();
    });
  },
};
