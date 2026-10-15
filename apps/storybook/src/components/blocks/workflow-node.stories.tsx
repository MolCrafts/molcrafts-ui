import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { StatusBadge, WorkflowNode } from "@molcrafts/ui";

const meta = {
  title: "Blocks/WorkflowNode",
  component: WorkflowNode,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { WorkflowNode } from "@molcrafts/ui". Node body for a workflow canvas: title, task type, role, status and error.',
      },
    },
  },
  args: { title: "Radial distribution", taskType: "compute.rdf", status: <StatusBadge status="running" /> },
} satisfies Meta<typeof WorkflowNode>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Failed: Story = { args: { status: <StatusBadge status="failed" />, error: "frame 12 is missing box" } };
export const InputNode: Story = { args: { title: "Trajectory", taskType: "io.read", canvasRole: "input", role: "initial" } };
export const Compact: Story = { args: { density: "compact", parallel: true } };
