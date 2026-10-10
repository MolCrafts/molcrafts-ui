import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent, within } from "storybook/test";
import {
  ThemeScope, Button, Badge, Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger,
  type ProductTheme,
} from "@molcrafts/ui";

const brand: ProductTheme = {
  primary: { background: "#00665e", hover: "#00574f", pressed: "#00473f", foreground: "#ffffff", muted: "#dcf3ee", mutedForeground: "#00574f", link: "#65dfcb", linkHover: "#8cf0df" },
  secondary: { background: "#735c0f", hover: "#614d0c", pressed: "#4d3d09", foreground: "#ffffff", muted: "#f8f0d4", mutedForeground: "#614d0c" },
};

const meta = {
  title: "Foundations/Theme scope", component: ThemeScope,
  args: { theme: "light" },
  parameters: { layout: "padded" },
  render: args => <ThemeScope {...args} className="space-y-4 rounded-panel p-4">
    <h2 className="text-title font-semibold">Scoped design system</h2>
    <div className="flex flex-wrap items-center gap-3"><Button>Primary action</Button><Button variant="secondary">Neutral action</Button><Badge variant="success">Completed</Badge></div>
    <Dialog><DialogTrigger asChild><Button variant="outline">Open themed dialog</Button></DialogTrigger>
      <DialogContent><DialogTitle>Themed dialog</DialogTitle><DialogDescription>The popup inherits mode and product colors from this scope.</DialogDescription><Button>Product action</Button></DialogContent>
    </Dialog>
    <ThemeScope theme="light" className="rounded-panel p-4"><p className="text-body">Nested light theme</p><Button variant="secondary">Light action</Button></ThemeScope>
  </ThemeScope>,
} satisfies Meta<typeof ThemeScope>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { theme: "dark" } };
export const Product: Story = {
  args: { theme: "dark", brand },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Open themed dialog" }));
    const dialog = await within(canvasElement).findByRole("dialog");
    await expect(getComputedStyle(within(dialog).getByRole("button", { name: "Product action" })).backgroundColor).toBe("rgb(0, 102, 94)");
    await userEvent.keyboard("{Escape}");
  },
};
export const RuntimeSwitch: Story = {
  render: () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    return <ThemeScope theme={theme} className="rounded-panel p-4"><Button onClick={() => setTheme(value => value === "light" ? "dark" : "light")}>Switch theme</Button><p className="mt-4 text-body">No component rebuild required.</p></ThemeScope>;
  },
};
