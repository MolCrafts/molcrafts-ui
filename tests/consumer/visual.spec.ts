import { expect, test } from "@playwright/test";

test("critical scoped control and overlay visuals", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/themes");
  await expect(page.locator("#scoped-primary")).toHaveCSS("background-color", "rgb(123, 50, 126)");
  await page.mouse.move(0, 0);
  await expect(page.locator("#product-scope")).toHaveScreenshot("scope-dark.png", { animations: "disabled", maxDiffPixelRatio: 0.005 });
  await page.getByRole("button", { name: "Toggle scope theme" }).click();
  await page.mouse.move(0, 0);
  await expect(page.locator("#product-scope")).toHaveScreenshot("scope-light.png", { animations: "disabled", maxDiffPixelRatio: 0.005 });
  await page.getByRole("button", { name: "Open scoped dialog" }).click();
  await page.mouse.move(0, 0);
  await expect(page.getByRole("dialog")).toHaveScreenshot("scope-dialog.png", { animations: "disabled", maxDiffPixelRatio: 0.005 });
});
