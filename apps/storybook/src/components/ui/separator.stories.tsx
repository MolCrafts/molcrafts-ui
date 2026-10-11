import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Separator } from "@molcrafts/ui";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: { docs: { description: { component: 'import { Separator } from "@molcrafts/ui"' } } },
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <p className="text-body">General</p>
      <Separator />
      <p className="text-body">Appearance</p>
    </div>
  ),
};
