import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, within } from "storybook/test";
import { AddRegular } from "@fluentui/react-icons";
import { Button } from "@molcrafts/ui";
import { Badge } from "@molcrafts/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@molcrafts/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@molcrafts/ui";

// Illustrative palettes only; actual product values belong to each product repository.
const customPalette: Record<"light" | "dark", CSSProperties & Record<string, string>> = {
  light: {
    "--primary": "#007a70", "--primary-hover": "#00665e", "--primary-pressed": "#00574f",
    "--primary-foreground": "#ffffff", "--primary-muted": "#d8f3ed", "--primary-muted-foreground": "#00574f",
    "--primary-primary-link": "#00665e", "--primary-link-hover": "#00574f",
    "--secondary": "#9b4700", "--secondary-hover": "#823c00", "--secondary-pressed": "#6a3100",
    "--secondary-foreground": "#ffffff", "--secondary-muted": "#fff0e0", "--secondary-muted-foreground": "#823c00",
  },
  dark: {
    "--primary": "#009c91", "--primary-hover": "#00b8a9", "--primary-pressed": "#00d4c3",
    "--primary-foreground": "#000000", "--primary-muted": "#003d38", "--primary-muted-foreground": "#65dfcb",
    "--primary-primary-link": "#65dfcb", "--primary-link-hover": "#8cf0df",
    "--secondary": "#f5a462", "--secondary-hover": "#ffb677", "--secondary-pressed": "#ffc894",
    "--secondary-foreground": "#000000", "--secondary-muted": "#4b280e", "--secondary-muted-foreground": "#ffc894",
  },
};

function ProductThemes({ mode }: { mode: "light" | "dark" }) {
  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <h1 className="text-heading font-semibold">Product brand palettes</h1>
      <p className="text-body text-muted-foreground">Each product owns its primary and secondary colors. Geometry, neutral actions, and status meanings stay shared.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {["Default palette", "Custom palette"].map((name, index) => (
          <Card key={name} data-palette={index ? "custom" : "default"} className="mol-product-theme" style={index ? customPalette[mode] : undefined}>
            <CardHeader><CardTitle>{name}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-body font-semibold">
                <div className="rounded-control bg-primary p-3 text-primary-foreground">Primary</div>
                <div className="rounded-control bg-secondary p-3 text-secondary-foreground">Secondary</div>
                <div className="rounded-control bg-primary-muted p-3 text-primary-muted-foreground">Selected</div>
                <div className="rounded-control bg-secondary-muted p-3 text-secondary-muted-foreground">Supporting brand</div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip><TooltipTrigger asChild><Button size="icon" aria-label="Create item"><AddRegular aria-hidden="true" /></Button></TooltipTrigger><TooltipContent>Create item</TooltipContent></Tooltip>
                <Button variant="secondary">Cancel</Button>
              </div>
              <Button variant="link" asChild><a href="#palette-contract">Brand link</a></Button>
              <div className="flex flex-wrap gap-2"><Badge variant="success">Completed</Badge><Badge variant="destructive">Failed</Badge></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p id="palette-contract" className="text-label text-muted-foreground">Custom colors are examples, not assigned product identities. Secondary brand color is independent of the neutral secondary button appearance.</p>
    </main>
  );
}

const meta = {
  title: "Foundations/Product themes",
  component: ProductThemes,
  parameters: { layout: "fullscreen" },
  play: async ({ canvasElement }) => {
    const normal = canvasElement.querySelector('[data-palette="default"]') as HTMLElement;
    const custom = canvasElement.querySelector('[data-palette="custom"]') as HTMLElement;
    const colors = (element: HTMLElement) => getComputedStyle(element);
    await expect(colors(within(custom).getByRole("button", { name: "Create item" })).backgroundColor)
      .not.toBe(colors(within(normal).getByRole("button", { name: "Create item" })).backgroundColor);
    await expect(colors(within(custom).getByRole("button", { name: "Cancel" })).backgroundColor)
      .toBe(colors(within(normal).getByRole("button", { name: "Cancel" })).backgroundColor);
    await expect(colors(custom.querySelector('[data-slot="badge"]') as HTMLElement).color)
      .toBe(colors(normal.querySelector('[data-slot="badge"]') as HTMLElement).color);
  },
} satisfies Meta<typeof ProductThemes>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { args: { mode: "light" }, globals: { theme: "light" } };
export const Dark: Story = { args: { mode: "dark" }, globals: { theme: "dark" } };
