import { expect, test } from "@playwright/test";

test("native public package builds and runs without the React entry", async ({ page }) => {
  const requested: string[] = [];
  page.on("request", request => requested.push(request.url()));
  await page.goto("/native.html");
  const button = page.locator("#native-primary");
  await expect(button).toHaveCSS("background-color", "rgb(17, 94, 163)");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Native count")).toHaveText("1");
  expect(await page.evaluate(() => !!customElements.get("fluent-tooltip"))).toBe(true);
  expect(requested.some(url => /lib-react/.test(url))).toBe(false);
});
