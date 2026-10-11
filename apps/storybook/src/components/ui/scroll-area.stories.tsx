import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ScrollArea } from "@molcrafts/design";

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  parameters: { docs: { description: { component: 'import { ScrollArea } from "@molcrafts/design"' } } },
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <ScrollArea className="h-32 w-64 rounded-panel border p-3">
      <div className="space-y-3 text-body">
        {["Foundations", "Controls", "Feedback", "Overlays", "Blocks"].map((name) => (
          <p key={name}>{name}</p>
        ))}
      </div>
    </ScrollArea>
  ),
};
