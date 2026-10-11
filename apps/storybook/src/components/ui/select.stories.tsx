import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@molcrafts/design";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: { docs: { description: { component: 'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      <Label htmlFor="format">Format</Label>
      <Select defaultValue="json">
        <SelectTrigger id="format" className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
