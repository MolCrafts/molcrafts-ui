import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { SettingsRow, SettingsSection } from "@molcrafts/ui";
import { Input } from "@molcrafts/ui";
import { Switch } from "@molcrafts/ui";
import { Badge } from "@molcrafts/ui";

const meta = {
  title: "Blocks/SettingsSection",
  component: SettingsSection,
  args: { title: "General", description: "Configure your workspace preferences.", children: null },
  render: (args) => (
    <div className="w-96"><SettingsSection {...args}>
      <SettingsRow label="Name" htmlFor="workspace-name"><Input id="workspace-name" defaultValue="Workspace" className="w-48" /></SettingsRow>
      <SettingsRow label="Auto save" htmlFor="workspace-autosave" tooltip="Save changes automatically."><Switch id="workspace-autosave" defaultChecked /></SettingsRow>
    </SettingsSection></div>
  ),
} satisfies Meta<typeof SettingsSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithStatus: Story = { args: { trailing: <Badge variant="secondary">Saved</Badge> } };
