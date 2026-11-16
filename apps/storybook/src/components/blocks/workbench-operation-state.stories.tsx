import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { WorkbenchAction, WorkbenchOperationState } from "@molcrafts/ui";

const meta = {
  title: "Blocks/WorkbenchOperationState",
  component: WorkbenchOperationState,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { WorkbenchOperationState } from "@molcrafts/ui". One surface for idle, loading, empty, error, running, success and disabled states.',
      },
    },
  },
  args: { kind: "empty", title: "No runs yet", detail: "Run the workflow to see results here." },
} satisfies Meta<typeof WorkbenchOperationState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Loading: Story = { args: { kind: "loading", skeletonRows: 3 } };
export const Failure: Story = {
  args: { kind: "error", title: "Run failed", detail: "frame 12 is missing box", action: <WorkbenchAction kind="secondary">Retry</WorkbenchAction> },
};
export const Running: Story = { args: { kind: "running", title: "Computing RDF" } };
