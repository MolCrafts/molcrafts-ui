import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Label, Switch } from "@molcrafts/design";

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: { docs: { description: { component: 'import { Switch } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="autosave" defaultChecked />
      <Label htmlFor="autosave">Auto save</Label>
    </div>
  ),
};
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="locked" disabled />
      <Label htmlFor="locked">Locked</Label>
    </div>
  ),
};
