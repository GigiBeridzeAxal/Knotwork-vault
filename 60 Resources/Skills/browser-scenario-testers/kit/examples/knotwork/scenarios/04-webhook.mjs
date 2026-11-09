import { api, logWorkflow, openApp } from "./kw.mjs";

export default {
  name: "Someone outside the workspace starts a run through the webhook",
  tags: ["integration", "propagation"],
  actors: ["alice", "dave"],
  expectedHttp: [404],
  async run({ actors: { alice, dave }, step, check, sees, eventually, runTag, baseURL, data }) {
    await step(alice, "creates a webhook workflow and reads its URL in the editor", async () => {
      await openApp(alice);
      const r = await api(alice, "POST", "/workflows", logWorkflow(`${runTag} hook`, { type: "webhook" }));
      check(r.status === 201, `create returned ${r.status}`);
      data.id = r.body.id;
      await alice.page.goto(`/workflows/${data.id}`);
      data.url = (await (await sees(alice, `/hooks/${r.body.hookKey}`)).textContent()).trim();
    });
    await step(dave, "POSTs to the webhook from his own browser context", async () => {
      const res = await dave.context.request.post(data.url, { data: { who: "dave" } });
      check(res.ok(), `webhook returned ${res.status()}`);
    });
    await step(dave, "a made-up hook key is refused", async () => {
      const res = await dave.context.request.post(`${baseURL}/hooks/not-a-real-key`, { data: {} });
      check(res.status() === 404, `fake hook returned ${res.status()}`);
    });
    await step(alice, "sees the webhook run pass, with dave's input", async () => {
      const run = await eventually(async () => {
        const runs = (await api(alice, "GET", `/runs?workflowId=${data.id}`)).body;
        return runs.find((r) => r.triggerType === "webhook" && r.status === "succeeded");
      }, { timeout: 20000, message: "no passed webhook run showed up" });
      await alice.page.goto(`/runs/${run.id}`);
      await sees(alice, "Passed");
      await sees(alice, "dave");
    });
    await step(alice, "cleans up", async () => api(alice, "DELETE", `/workflows/${data.id}`));
  },
};
