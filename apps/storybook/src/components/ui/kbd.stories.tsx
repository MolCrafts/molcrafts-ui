import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Kbd } from "@molcrafts/ui";

const meta = {
  title: "UI/Kbd",
  component: Kbd,
  parameters: { docs: { description: { component: 'import { Kbd } from "@molcrafts/ui". One shortcut chip.' } } },
  args: { children: "?" },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Chord: Story = { args: { children: "Shift+G" } };
