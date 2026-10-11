import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Label, Slider } from "@molcrafts/design";

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: { docs: { description: { component: 'import { Slider } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <Label id="volume-label">Volume</Label>
      <Slider aria-labelledby="volume-label" defaultValue={[40]} max={100} step={1} />
    </div>
  ),
};
