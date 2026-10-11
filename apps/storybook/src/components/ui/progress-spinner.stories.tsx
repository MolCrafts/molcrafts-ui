import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ProgressSpinner } from "@molcrafts/design";

const meta = {
  title: "UI/ProgressSpinner",
  component: ProgressSpinner,
  parameters: { docs: { description: { component: 'import { ProgressSpinner } from "@molcrafts/design"' } } },
} satisfies Meta<typeof ProgressSpinner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-body">
      <ProgressSpinner />
      <span>Loading items…</span>
    </div>
  ),
};
