import { api, logWorkflow, openApp } from "./kw.mjs";

export default {
  name: "A phone user runs a workflow by hand and reads the log",
  tags: ["mobile", "core-flow"],
  actors: ["erin"],
  async run({ actors: { erin }, step, check, sees, runTag, data }) {
    await step(erin, "has a workflow", async () => {
      await openApp(erin);
      data.id = (await api(erin, "POST", "/workflows", logWorkflow(`${runTag} phone`))).body.id;
    });
    await step(erin, "opens it and taps Run now, then Run with her input", async () => {
      await erin.page.goto(`/workflows/${data.id}`);
      await erin.page.getByRole("button", { name: "Run now" }).click();
      await erin.page.locator("#run-input").fill('{ "who": "erin" }');
      await erin.page.getByRole("button", { name: "Run", exact: true }).click();
      await erin.page.waitForURL(/\/runs\//);
    });
    await step(erin, "sees the run pass and her name in the log", async () => {
      await sees(erin, "Passed", { timeout: 15000 });
      await sees(erin, "hello erin");
    });
    await step(erin, "the page fits the phone: no sideways scroll", async () => {
      const over = await erin.page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(over <= 1, `page is ${over}px wider than the screen`);
    });
    await step(erin, "cleans up", async () => api(erin, "DELETE", `/workflows/${data.id}`));
  },
};
