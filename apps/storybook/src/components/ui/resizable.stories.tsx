import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@molcrafts/ui";

const meta = {
  title: "UI/Resizable",
  component: ResizablePanelGroup,
  parameters: { docs: { description: { component: 'import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@molcrafts/ui"' } } },
  args: { direction: "horizontal" },
  argTypes: { direction: { control: "select", options: ["horizontal", "vertical"] } },
  render: (args) => (
    <div className="h-64 w-96 rounded-panel border">
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={30} minSize={20}><div className="flex h-full items-center justify-center text-body">Sidebar</div></ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={30}><div className="flex h-full items-center justify-center text-body">Content</div></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
} satisfies Meta<typeof ResizablePanelGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Horizontal: Story = {};
export const Vertical: Story = { args: { direction: "vertical" } };
