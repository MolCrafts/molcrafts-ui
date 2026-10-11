import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { SettingsRow, SettingsSection } from "@molcrafts/design";
import { Input } from "@molcrafts/design";
import { Switch } from "@molcrafts/design";
import { Badge } from "@molcrafts/design";

const meta = {
  title: "Blocks/SettingsSection",
  component: SettingsSection,
  parameters: { docs: { description: { component: 'import { SettingsSection, SettingsRow } from "@molcrafts/design"' } } },
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
