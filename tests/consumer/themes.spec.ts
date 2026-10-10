import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => { await page.goto("/themes"); });

test("nested modes reset colors and status aliases; portals inherit the nearest scope", async ({ page }) => {
  const scope = page.locator("#product-scope");
  await expect(scope).toHaveCSS("color-scheme", "dark");
  await expect(page.locator("#nested-light")).toHaveCSS("color-scheme", "light");
  await expect(page.getByRole("button", { name: "Nested light primary" })).toHaveCSS("background-color", "rgb(15, 108, 189)");
  const status = await scope.getByText("Completed", { exact: true }).evaluate(el => getComputedStyle(el).color);
  expect(await page.getByText("Nested completed", { exact: true }).evaluate(el => getComputedStyle(el).color)).not.toBe(status);
  await page.getByRole("button", { name: "Open scoped dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Scoped dialog", exact: true });
  await expect(dialog).toHaveCSS("background-color", "rgb(41, 41, 41)");
  expect(await dialog.evaluate(el => el.closest("[data-mol-theme]")?.id)).toBe("product-scope");
  await expect(dialog.getByRole("button", { name: "Change dialog brand" })).toHaveCSS("background-color", "rgb(123, 50, 126)");
  await dialog.getByRole("button", { name: "Change dialog brand" }).click();
  // Move away from the hovered/pressed action before checking its resting palette.
  await dialog.getByRole("heading").hover();
  await expect(dialog.getByRole("button", { name: "Change dialog brand" })).toHaveCSS("background-color", "rgb(0, 102, 94)");
  await dialog.getByRole("button", { name: "Toggle dialog theme" }).click();
  await expect(dialog).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open scoped dialog" })).toBeFocused();
  await page.getByRole("button", { name: "Open nested dialog" }).click();
  const nested = page.getByRole("dialog", { name: "Nested light dialog" });
  expect(await nested.evaluate(el => el.closest("[data-mol-theme]")?.id)).toBe("nested-light");
  await expect(nested).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("all managed overlay families stay in the product scope", async ({ page }) => {
  for (const [trigger, role, name] of [
    ["Open scoped sheet", "dialog", "Scoped sheet"],
    ["Open scoped alert", "alertdialog", "Scoped alert"],
    ["Open scoped popover", "dialog", "Scoped popover"],
  ] as const) {
    await page.getByRole("button", { name: trigger }).click();
    const overlay = page.getByRole(role, { name });
    await expect(overlay).toHaveCSS("background-color", "rgb(41, 41, 41)");
    expect(await overlay.evaluate(el => el.closest("[data-mol-theme]")?.id)).toBe("product-scope");
    if (role === "alertdialog") await page.getByRole("button", { name: "Cancel alert" }).click();
    else await page.keyboard.press("Escape");
    await expect(overlay).not.toBeVisible();
  }
  await page.getByRole("combobox", { name: "Choose scoped item" }).click();
  await expect(page.getByRole("listbox")).toHaveCSS("background-color", "rgb(41, 41, 41)");
  await page.getByRole("option", { name: "Second item" }).click();
  for (const [trigger, item, button] of [
    ["Scoped menu", "Run action", "left"], ["Context actions", "Inspect action", "right"],
  ] as const) {
    await page.getByRole("button", { name: trigger }).click({ button });
    const menu = page.getByRole("menu");
    await expect(menu).toHaveCSS("background-color", "rgb(41, 41, 41)");
    expect(await menu.evaluate(el => el.closest("[data-mol-theme]")?.id)).toBe("product-scope");
    await page.getByRole("menuitem", { name: item }).click();
  }
  await page.getByRole("button", { name: "Scoped help" }).hover();
  await expect(page.getByRole("tooltip")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  expect(await page.getByRole("tooltip").evaluate(el => el.closest("[data-mol-theme]")?.id)).toBe("product-scope");
});

test("theme and brand changes preserve neutral/status roles, contrast and accessible dialogs", async ({ page }) => {
  const neutral = page.getByRole("button", { name: "Neutral action" });
  const color = await neutral.evaluate(el => getComputedStyle(el).backgroundColor);
  const success = await page.getByText("Completed", { exact: true }).evaluate(el => getComputedStyle(el).color);
  await page.getByRole("button", { name: "Change scope brand" }).click();
  await expect(page.locator("#scoped-primary")).toHaveCSS("background-color", "rgb(0, 102, 94)");
  await expect(neutral).toHaveCSS("background-color", color);
  await expect(page.getByText("Completed", { exact: true })).toHaveCSS("color", success);
  for (const mode of ["dark", "light"] as const) {
    if (mode === "light") await page.getByRole("button", { name: "Toggle scope theme" }).click();
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations, `${mode}: ${JSON.stringify(result.violations)}`).toEqual([]);
    await page.getByRole("button", { name: "Open scoped dialog" }).click();
    await expect.poll(() => page.getByRole("dialog").evaluate(el => el.getAnimations({ subtree: true }).every(animation => animation.playState === "finished"))).toBe(true);
    const dialogResult = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(dialogResult.violations, `${mode} dialog: ${JSON.stringify(dialogResult.violations)}`).toEqual([]);
    await page.keyboard.press("Escape");
  }
});

test("keyboard focus, forced colors and reduced motion remain effective inside scoped portals", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  const button = page.locator("#scoped-primary");
  await button.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS("outline-style", "solid");
  await expect(button).toHaveCSS("outline-width", "2px");
  await expect(button).toHaveCSS("border-top-width", "1px");
  await expect(page.locator("#product-scope .mol-progress-spinner")).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "Open scoped dialog" }).click();
  await expect(page.getByRole("dialog")).toHaveCSS("animation-name", "none");
});


test("foundation geometry is read from runtime CSS rather than baked into utilities", async ({ page }) => {
  await page.locator("#product-scope").evaluate(el => {
    const style = (el as HTMLElement).style;
    style.setProperty("--spacing-control", "36px");
    style.setProperty("--radius-control", "6px");
    style.setProperty("--text-body", "15px");
  });
  await expect(page.locator("#scoped-primary")).toHaveCSS("height", "36px");
  await expect(page.locator("#scoped-primary")).toHaveCSS("border-radius", "6px");
  await expect(page.locator("#scoped-primary")).toHaveCSS("font-size", "15px");
  // Explicit nested scope owns its complete foundation again.
  await expect(page.getByRole("button", { name: "Nested light primary" })).toHaveCSS("height", "32px");
});
