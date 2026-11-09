// Small Knotwork helpers shared by the scenarios. Setup goes through the API (fast); the behaviour
// under test goes through the UI.
export const workspaceOf = (a) => a.page.evaluate(() => localStorage.getItem("knotwork.workspace"));

export async function api(a, method, path, body) {
  return a.page.evaluate(
    async ({ method, path, body }) => {
      const res = await fetch("/api" + path, {
        method,
        headers: { "content-type": "application/json", "x-knotwork-workspace": localStorage.getItem("knotwork.workspace") },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      return { status: res.status, body: await res.json().catch(() => null) };
    },
    { method, path, body },
  );
}

export const logWorkflow = (name, trigger = { type: "manual" }) => ({
  name,
  description: "",
  enabled: true,
  trigger,
  steps: [{ id: "log_1", name: "Log", type: "log", retry: { max: 0, backoffSeconds: 5 }, config: { message: "hello {{ trigger.body.who }}" } }],
});

export async function openApp(a) {
  await a.page.goto("/workflows");
  await a.page.getByRole("heading", { name: "Workflows" }).waitFor();
}

export async function createInUi(a, name) {
  await a.page.goto("/workflows/new");
  const field = a.page.locator("#wf-name");
  await field.fill(name);
  await a.page.getByRole("button", { name: "Create" }).click();
  await a.page.waitForURL(/\/workflows\/(?!new)[^/]+$/);
  return a.page.url().split("/").pop();
}
