import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Label, Textarea } from "@molcrafts/ui";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { docs: { description: { component: 'import { Textarea } from "@molcrafts/ui"' } } },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea id="notes" placeholder="Add a description" />
    </div>
  ),
};
export const Invalid: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="notes-invalid">Notes</Label>
      <Textarea id="notes-invalid" aria-invalid defaultValue="Too short" aria-describedby="notes-error" />
      <p id="notes-error" className="text-label text-status-failed-foreground">Enter at least a sentence.</p>
    </div>
  ),
};
