import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { MetricList } from "@molcrafts/ui";

const meta = {
  title: "Blocks/MetricList",
  component: MetricList,
  parameters: { layout: "padded", docs: { description: { component: 'import { MetricList } from "@molcrafts/ui". Scalar fields of one object. Two columns from the small breakpoint.' } } },
  args: { metrics: [
    { label: "neighbor_list/1k", value: "18.4", unit: "µs" },
    { label: "neighbor_list/10k", value: "201", unit: "µs" },
    { label: "pair_energy/1k", value: "6.12", unit: "µs" },
    { label: "pair_energy/10k", value: "64.0", unit: "µs" },
    { label: "Peak memory", value: "412", unit: "MB" },
  ] },
} satisfies Meta<typeof MetricList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const OneColumn: Story = { args: { columns: 1 }, render: args => <div className="w-80"><MetricList {...args} /></div> };
