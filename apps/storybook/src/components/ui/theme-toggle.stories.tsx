import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ThemeToggle, type ThemeMode } from "@molcrafts/ui";

function Controlled() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  return <div className="flex items-center gap-3 text-body"><ThemeToggle theme={theme} onThemeChange={setTheme} />Showing {theme}</div>;
}

const meta = {
  title: "UI/ThemeToggle",
  component: ThemeToggle,
  parameters: { docs: { description: { component: 'import { ThemeToggle } from "@molcrafts/ui". Controlled. The product keeps the preference, its storage key, and where the theme class is applied.' } } },
  args: { theme: "light", onThemeChange: () => {} },
} satisfies Meta<typeof ThemeToggle>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: () => <Controlled /> };
export const Dark: Story = { args: { theme: "dark" } };
