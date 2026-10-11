import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Input, Label } from "@molcrafts/design";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: { docs: { description: { component: 'import { Label } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <Label htmlFor="workspace">Workspace</Label>
      <Input id="workspace" defaultValue="MolCrafts" />
    </div>
  ),
};
