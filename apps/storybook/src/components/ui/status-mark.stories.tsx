import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { StatusMark, type Status } from "@molcrafts/design";

const statuses: Status[] = ["draft", "ready", "queued", "running", "completed", "failed", "cancelled", "cached", "warning"];

const meta = {
  title: "UI/StatusMark",
  component: StatusMark,
  parameters: { docs: { description: { component: 'import { StatusMark, type Status } from "@molcrafts/design". Decorative dot for the nine constitution statuses. Always pair it with the status word.' } } },
  args: { status: "completed" },
} satisfies Meta<typeof StatusMark>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: args => <span className="inline-flex items-center gap-2 text-body"><StatusMark {...args} />{args.status}</span> };
export const Vocabulary: Story = {
  render: () => (
    <ul className="grid grid-cols-3 gap-x-6 gap-y-2 text-body">
      {statuses.map(status => <li key={status} className="flex items-center gap-2"><StatusMark status={status} />{status}</li>)}
    </ul>
  ),
};
