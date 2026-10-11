import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@molcrafts/ui";

const meta = {
  title: "UI/ContextMenu",
  component: ContextMenu,
  parameters: { docs: { description: { component: 'import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@molcrafts/ui"' } } },
} satisfies Meta<typeof ContextMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-panel border border-dashed text-body">
        Right-click this surface
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
