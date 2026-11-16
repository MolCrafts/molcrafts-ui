import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { SettingsSection, SettingsShell, type SettingsNavEntry } from "@molcrafts/ui";

const entries: SettingsNavEntry[] = [
  {
    id: "general",
    label: "General",
    content: <SettingsSection id="general" title="General" description="Workspace name and language."><p className="text-body">These settings apply to the whole workspace.</p></SettingsSection>,
  },
  {
    id: "appearance",
    label: "Appearance",
    group: "display",
    groupLabel: "Display",
    content: <SettingsSection id="appearance" title="Appearance" description="Theme follows the product."><p className="text-body">Light and dark both stay available.</p></SettingsSection>,
  },
];

const meta = {
  title: "Blocks/SettingsShell",
  component: SettingsShell,
  parameters: {
    layout: "padded",
    docs: { description: { component: 'import { SettingsShell, SettingsSection } from "@molcrafts/ui"' } },
  },
} satisfies Meta<typeof SettingsShell>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { title: "Settings", entries },
  render: (args) => <SettingsShell {...args} className="h-[28rem] w-full max-w-3xl" />,
};
export const Plain: Story = {
  args: { chrome: "plain", entries },
  render: (args) => <SettingsShell {...args} className="h-[28rem] w-full max-w-3xl border border-border" />,
};
