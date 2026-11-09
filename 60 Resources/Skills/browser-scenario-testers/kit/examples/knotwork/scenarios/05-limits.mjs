import { api, logWorkflow, openApp } from "./kw.mjs";

export default {
  name: "One heavy user hits the workflow limit without affecting others",
  tags: ["limits", "isolation"],
  actors: ["frank", "erin"],
  expectedHttp: [409],
  async run({ actors: { frank, erin }, step, check, sees, runTag, data }) {
    await step(frank, "fills his workspace up to the limit", async () => {
      await openApp(frank);
      data.max = (await (await frank.page.request.get("/api/limits")).json()).workflowsPerWorkspace;
      const have = (await api(frank, "GET", "/workflows")).body.length;
      for (let i = have; i < data.max; i++) {
        const r = await api(frank, "POST", "/workflows", logWorkflow(`${runTag} fill ${i}`));
        check(r.status === 201, `workflow ${i + 1} of ${data.max} was refused (${r.status})`);
      }
    });
    await step(frank, "one more in the UI is refused with a clear message", async () => {
      await frank.page.goto("/workflows/new");
      await frank.page.locator("#wf-name").fill(`${runTag} one too many`);
      await frank.page.getByRole("button", { name: "Create" }).click();
      await sees(frank, `A workspace can hold ${data.max} workflows`);
    });
    await step(erin, "is not affected: can still create one", async () => {
      await openApp(erin);
      const r = await api(erin, "POST", "/workflows", logWorkflow(`${runTag} erin`));
      check(r.status === 201, `erin was refused with ${r.status}`);
      data.erin = r.body.id;
    });
    await step(frank, "cleans up", async () => {
      for (const w of (await api(frank, "GET", "/workflows")).body) await api(frank, "DELETE", `/workflows/${w.id}`);
      await api(erin, "DELETE", `/workflows/${data.erin}`);
    });
  },
};
