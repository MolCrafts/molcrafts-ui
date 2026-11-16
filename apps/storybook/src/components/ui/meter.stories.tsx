import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Meter } from "@molcrafts/ui";

const meta = {
  title: "UI/Meter",
  component: Meter,
  parameters: { docs: { description: { component: 'import { Meter } from "@molcrafts/ui". A thin bar for one percentage. Without label it is decorative, so show the formatted value next to it.' } } },
  args: { value: 72 },
  render: args => <div className="w-48"><Meter {...args} /></div>,
} satisfies Meta<typeof Meter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Tones: Story = {
  render: () => (
    <dl className="grid w-64 grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 text-body">
      {([["Lines", 91, "completed"], ["Branches", 74, "warning"], ["Functions", 52, "failed"]] as const).map(([label, value, tone]) => (
        <div key={label} className="contents"><dt className="flex flex-col gap-1">{label}<Meter value={value} tone={tone} /></dt><dd className="tabular-nums">{value}%</dd></div>
      ))}
    </dl>
  ),
};
export const Labelled: Story = { args: { value: 40, label: "Disk used" } };
