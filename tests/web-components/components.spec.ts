import { test, expect } from "@playwright/test";

interface AccessibilityNode {
  role?: { value: string };
  name?: { value: string };
  properties?: { name: string; value: { value: unknown } }[];
}
declare global {
  interface Window {
    ready: boolean;
    registerAgain: () => Promise<void>;
    managedTags: string[];
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(() => window.ready);
});

test("standalone bundle registers every managed element and remains idempotent", async ({ page }) => {
  const registered = await page.evaluate(async () => {
    await window.registerAgain();
    return window.managedTags.every(tag => !!customElements.get(tag));
  });
  expect(registered).toBe(true);
  expect(await page.locator("fluent-button").first().evaluate(el => !!el.shadowRoot)).toBe(true);
  expect(await page.locator("body").evaluate(() => [...document.scripts].every(script => !script.src.includes("react")))).toBe(true);
});

test("icon actions work with keyboard, expose tooltips, and respect disabled state", async ({ page }) => {
  // Playwright role selectors do not currently read ElementInternals default roles.
  // Verify the browser accessibility tree directly, then interact with the host.
  const session = await page.context().newCDPSession(page);
  const tree = await session.send("Accessibility.getFullAXTree") as { nodes: AccessibilityNode[] };
  expect(tree.nodes.some(node => node.role?.value === "button" && node.name?.value === "Add item")).toBe(true);
  const action = page.locator("#add");
  await page.keyboard.press("Tab");
  await expect(action).toBeFocused();
  await expect(page.locator("fluent-tooltip")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#count")).toHaveText("1");
  await page.keyboard.press("Space");
  await expect(page.locator("#count")).toHaveText("2");
  const disabledNode = tree.nodes.find(node => node.name?.value === "Disabled action");
  expect(disabledNode?.properties?.some(property => property.name === "disabled" && property.value.value === true)).toBe(true);
  expect(await page.locator("#disabled").evaluate(element => element.matches(":disabled") && element.tabIndex === -1)).toBe(true);
});

test("form-associated controls participate in native FormData and submission", async ({ page }) => {
  const session = await page.context().newCDPSession(page);
  const tree = await session.send("Accessibility.getFullAXTree") as { nodes: AccessibilityNode[] };
  expect(tree.nodes.filter(node => node.role?.value === "textbox").map(node => node.name?.value)).toEqual(expect.arrayContaining(["Name", "Notes"]));
  await page.locator("fluent-text-input input").fill("Team workspace");
  await page.locator("#notifications").click();
  await page.locator("#autosave").click();
  await page.locator('fluent-button[type="submit"]').click();
  await expect(page.locator("#saved")).toHaveText(JSON.stringify({ name: "Team workspace", notes: "Shared UI", notifications: "on", autosave: "on" }));
});

test("host geometry and neutral borders survive application resets", async ({ page }) => {
  await page.addStyleTag({ content: "* { border: 0 solid; padding: 0; margin: 0; font: inherit; }" });
  await expect(page.locator("#add")).toHaveCSS("width", "32px");
  await expect(page.locator("#add")).toHaveCSS("height", "32px");
  await expect(page.locator('fluent-button[type="submit"]')).toHaveCSS("border-top-width", "1px");
  expect(await page.locator("#tab-one").evaluate(el => parseFloat(getComputedStyle(el).paddingInlineStart))).toBeGreaterThan(0);
});

test("product brands cross Shadow DOM while dark, reduced-motion and high-contrast modes work", async ({ page }) => {
  const action = page.locator("#add");
  await page.locator("html").evaluate(el => el.classList.add("dark"));
  await expect(action).toHaveCSS("background-color", "rgb(17, 94, 163)");
  await page.locator("#autosave").click();
  await expect(page.locator("#autosave .checked-indicator")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.locator("main").evaluate(el => {
    el.classList.add("mol-product-theme");
    el.style.setProperty("--primary", "#007a70");
    el.style.setProperty("--primary-hover", "#00665e");
  });
  await expect(action).toHaveCSS("background-color", "rgb(0, 122, 112)");
  await action.hover();
  await expect(action).toHaveCSS("background-color", "rgb(0, 102, 94)");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("fluent-spinner .spinner")).toHaveCSS("animation-name", "none");
  await page.emulateMedia({ forcedColors: "active" });
  await action.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(action).toHaveCSS("outline-style", "solid");
});
