import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("native runtime, compiler adapter, signals, data, resize, export and scoped themes", async ({ page }) => {
  const failures: string[] = [];
  page.on("pageerror", error => failures.push(error.message));
  await page.goto("/charts");
  const native = page.getByRole("figure", { name: "Native Vega measurements", exact: true });
  const lite = page.getByRole("figure", { name: "Vega-Lite measurements", exact: true });
  await expect(native).toHaveAttribute("data-chart-state", "ready");
  await expect(lite).toHaveAttribute("data-chart-state", "ready");
  await expect(page.getByRole("figure", { name: "Canvas measurements" }).locator("canvas")).toBeVisible();
  await expect(page.getByRole("figure", { name: "Empty measurements" })).toHaveAttribute("data-chart-state", "empty");
  await expect(page.getByRole("figure", { name: "Loading measurements" })).toHaveAttribute("data-chart-state", "loading");
  await expect(page.getByRole("figure", { name: "Invalid Lite measurements" }).getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Update signal" }).click();
  await expect(page.getByRole("status", { name: "Signal value" })).toHaveText("2");
  const ready = await page.getByRole("status", { name: "Ready count" }).textContent();
  await page.getByRole("button", { name: "Update chart data" }).click();
  await expect(native.locator(".mark-symbol path")).toHaveCount(1);
  await expect(page.getByRole("status", { name: "Ready count" })).toHaveText(ready!);
  await page.getByRole("button", { name: "Export SVG" }).click();
  await expect(page.getByRole("status", { name: "Exported SVG" })).toContainText("<svg");
  const before = await lite.locator("svg").getAttribute("width");
  await page.getByRole("button", { name: "Resize chart" }).click();
  await expect.poll(() => lite.locator("svg").getAttribute("width")).not.toBe(before);
  const colors = () => lite.locator(".mark-line path").first().getAttribute("stroke");
  const initial = await colors();
  await page.getByRole("button", { name: "Chart theme" }).click();
  await expect.poll(colors).not.toBe(initial);
  await expect(lite).toHaveAttribute("data-chart-state", "ready");
  await page.getByTestId("chart-scope").evaluate(element => (element as HTMLElement).style.setProperty("--primary", "rgb(153, 51, 153)"));
  await expect.poll(colors).toBe("rgb(153, 51, 153)");
  const scan = await new AxeBuilder({ page }).include('[data-testid="chart-scope"]').analyze();
  expect(scan.violations).toEqual([]);
  const bounds = await page.getByTestId("table-scroll").evaluate(element => ({ width: element.clientWidth, inner: element.querySelector('[data-radix-scroll-area-viewport]')!.clientWidth }));
  expect(bounds.inner).toBeLessThanOrEqual(bounds.width);
  expect(failures).toEqual([]);
});

test("replacement, parse errors, recovery and StrictMode mount disposal", async ({ page }) => {
  await page.goto("/charts");
  const chart = page.getByRole("figure", { name: "Native Vega measurements", exact: true });
  await expect(chart).toHaveAttribute("data-chart-state", "ready");
  await page.getByRole("button", { name: "Invalid spec" }).click();
  await expect(chart.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Invalid spec" }).click();
  await expect(chart).toHaveAttribute("data-chart-state", "ready");
  await expect(chart.locator("svg")).toHaveCount(1);
  await page.getByRole("button", { name: "Mount chart" }).click();
  await expect(chart).toHaveCount(0);
  await page.getByRole("button", { name: "Mount chart" }).click();
  await expect(chart).toHaveAttribute("data-chart-state", "ready");
  await expect(chart.locator("svg")).toHaveCount(1);
});

test("Fluent chart axes and marks in light and dark scopes", async ({ page }) => {
  await page.goto("/charts");
  const chart = page.getByRole("figure", { name: "Vega-Lite measurements", exact: true });
  await expect(chart).toHaveAttribute("data-chart-state", "ready");
  await expect(chart).toHaveScreenshot("vega-lite-light.png", { animations: "disabled" });
  await page.getByRole("button", { name: "Chart theme" }).click();
  await expect.poll(() => chart.locator(".mark-line path").first().getAttribute("stroke")).not.toBe("rgb(15, 108, 189)");
  await expect(chart).toHaveAttribute("data-chart-state", "ready");
  await expect(chart).toHaveScreenshot("vega-lite-dark.png", { animations: "disabled" });
});
