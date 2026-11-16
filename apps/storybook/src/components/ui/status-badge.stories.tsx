import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { StatusBadge } from "@molcrafts/ui";

const meta = {
  title: "UI/StatusBadge",
  component: StatusBadge,
  parameters: {
    docs: {
      description: {
        component:
          'import { StatusBadge, statusToneFor } from "@molcrafts/ui". Maps any run status string onto one canonical tone; unknown or empty statuses render nothing.',
      },
    },
  },
  args: { status: "running" },
} satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const AllTones: Story = {
  render: args => (
    <div className="flex flex-wrap gap-2">
      {["draft", "ready", "queued", "running", "completed", "failed", "cancelled", "cached", "warning"].map(status => (
        <StatusBadge key={status} {...args} status={status} />
      ))}
    </div>
  ),
};
export const DotOnly: Story = { args: { status: "failed", dot: true, showLabel: false } };
