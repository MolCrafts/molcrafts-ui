import { expect, test } from "@playwright/test";

test("built public exports provide component CSS, interactions and runtime themes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const primary = page.getByRole("button", { name: "Increment" });
  await expect(primary).toHaveCSS("height", "40px");
  await expect(primary).toHaveCSS("border-radius", "4px");
  await expect(primary).toHaveCSS("background-color", "rgb(15, 108, 189)");
  await expect(primary).toHaveCSS("font-size", "14px");
  await primary.click();
  await expect(page.getByLabel("Count", { exact: true })).toHaveText("1");
  await page.getByLabel("Quantity", { exact: true }).fill("25");
  await page.getByLabel("Quantity", { exact: true }).press("Enter");
  await expect(page.getByLabel("Quantity value", { exact: true })).toHaveText("10");
  await page.getByRole("checkbox", { name: "Enable notifications" }).press("Space");
  await expect(page.getByRole("checkbox", { name: "Enable notifications" })).toBeChecked();
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(primary).toHaveCSS("background-color", "rgb(17, 94, 163)");
  await expect(page.getByRole("button", { name: "Product action" })).toHaveCSS("background-color", "rgb(123, 50, 126)");
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toHaveCSS("background-color", "rgb(41, 41, 41)");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});
