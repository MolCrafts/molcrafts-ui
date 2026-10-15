import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Label, Slider } from "@molcrafts/ui";

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: { docs: { description: { component: 'import { Slider } from "@molcrafts/ui"' } } },
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

export const Range: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <Label id="range-label">Temperature window (K)</Label>
      <Slider aria-labelledby="range-label" defaultValue={[280, 320]} min={200} max={400} step={5} thumbLabels={["Minimum", "Maximum"]} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-40 items-stretch gap-6">
      <Slider orientation="vertical" defaultValue={[30]} max={100} thumbLabels={["Level"]} />
      <Slider orientation="vertical" defaultValue={[20, 70]} max={100} thumbLabels={["Low", "High"]} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <Label id="locked-label">Cutoff (Å)</Label>
      <Slider aria-labelledby="locked-label" defaultValue={[12]} max={20} step={0.5} disabled thumbLabels={["Cutoff"]} />
    </div>
  ),
};
