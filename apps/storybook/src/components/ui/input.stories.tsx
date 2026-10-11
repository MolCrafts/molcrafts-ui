import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Input, Label } from "@molcrafts/design";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: { docs: { description: { component: 'import { Input } from "@molcrafts/design"' } } },
  args: { placeholder: "Enter a value", "aria-label": "Value" },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, defaultValue: "Workspace" } };
export const Invalid: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" aria-invalid defaultValue="invalid" aria-describedby="email-error" />
      <p id="email-error" className="text-label text-status-failed-foreground">Enter a valid email address.</p>
    </div>
  ),
};
