import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { EdgePanel } from "@molcrafts/ui";

function EdgePanelDemo() {
  const [open, setOpen] = useState(true);
  const [size, setSize] = useState(160);
  return (
    <div className="relative h-80 w-full max-w-xl overflow-hidden rounded-panel border bg-background">
      <p className="p-4 text-body">Pull the bottom edge to resize the panel.</p>
      <EdgePanel
        side="bottom"
        open={open}
        size={size}
        onOpenChange={setOpen}
        onSizeChange={setSize}
        header={<p className="px-4 py-2 text-body font-semibold">Panel</p>}
      >
        <p className="px-4 text-body">Notes for this workspace.</p>
      </EdgePanel>
    </div>
  );
}

const meta = {
  title: "Blocks/EdgePanel",
  component: EdgePanel,
  parameters: { docs: { description: { component: 'import { EdgePanel } from "@molcrafts/ui"' } } },
} satisfies Meta<typeof EdgePanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Bottom: Story = {
  args: { side: "bottom", open: true, size: 160, onOpenChange: () => {}, onSizeChange: () => {}, children: "Notes for this workspace." },
  render: () => <EdgePanelDemo />,
};
