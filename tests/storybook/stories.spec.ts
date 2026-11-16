import { expect, test } from "@playwright/test";

test("every public-package story renders and completes its interaction play", async ({ page, request }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const index = await (await request.get("/index.json")).json();
  const stories = Object.values(index.entries).filter((entry: any) => entry.type === "story") as { id: string }[];
  expect(stories.length).toBeGreaterThan(0);
  for (const story of stories) {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    await page.waitForFunction(() => {
      const phase = (window as any).__STORYBOOK_PREVIEW__?.currentRender?.phase;
      return ["completed", "finished", "errored"].includes(phase);
    });
    expect(await page.evaluate(() => (window as any).__STORYBOOK_PREVIEW__.currentRender.phase), story.id).not.toBe("errored");
    expect(await page.locator("#storybook-root").innerHTML(), story.id).not.toBe("");
    expect(errors, story.id).toEqual([]);
  }
});

test("Autodocs still discovers the built public Button API", async ({ page }) => {
  await page.goto("/iframe.html?id=ui-button--docs&viewMode=docs");
  await expect(page.getByRole("heading", { name: "Button", exact: true }).first()).toBeVisible();
  await expect(page.getByText("variant", { exact: true }).first()).toBeVisible();
});
