import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Input } from "@molcrafts/design";
import { Label } from "@molcrafts/design";
import { Textarea } from "@molcrafts/design";
import { Checkbox } from "@molcrafts/design";
import { Switch } from "@molcrafts/design";
import { Slider } from "@molcrafts/design";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@molcrafts/design";

const meta = {
  title: "UI/Input",
  component: Input,
  args: { placeholder: "Enter a value", "aria-label": "Value" },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true, defaultValue: "Read only preview" } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "Invalid value" } };
export const FormControls: Story = {
  render: () => (
    <div className="w-80 space-y-5">
      <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" placeholder="Untitled" /></div>
      <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" placeholder="Add a description" /></div>
      <div className="space-y-2">
        <Label htmlFor="format">Format</Label>
        <Select defaultValue="json"><SelectTrigger id="format"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="json">JSON</SelectItem><SelectItem value="csv">CSV</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2"><Checkbox id="notifications" defaultChecked /><Label htmlFor="notifications">Notifications</Label></div>
      <div className="flex items-center gap-2"><Switch id="autosave" defaultChecked /><Label htmlFor="autosave">Auto save</Label></div>
      <div className="space-y-2"><Label id="volume-label">Volume</Label><Slider aria-labelledby="volume-label" defaultValue={[50]} max={100} step={1} /></div>
    </div>
  ),
};
