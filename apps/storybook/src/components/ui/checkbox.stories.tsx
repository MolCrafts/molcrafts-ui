import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Checkbox, Label } from "@molcrafts/design";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: { docs: { description: { component: 'import { Checkbox } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="notify" defaultChecked />
      <Label htmlFor="notify">Receive notifications</Label>
    </div>
  ),
};
export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="locked" disabled />
      <Label htmlFor="locked">Locked</Label>
    </div>
  ),
};
