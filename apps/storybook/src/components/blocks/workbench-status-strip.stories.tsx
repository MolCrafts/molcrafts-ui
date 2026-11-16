import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { WorkbenchStatusStrip } from "@molcrafts/ui";

const meta = {
  title: "Blocks/WorkbenchStatusStrip",
  component: WorkbenchStatusStrip,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { WorkbenchStatusStrip } from "@molcrafts/ui". Bottom status line: message by kind, optional progress, heartbeat refresh and dismiss.',
      },
    },
  },
  args: { text: "Connected to kernel", kind: "info", beat: 1, onRefresh: () => {} },
} satisfies Meta<typeof WorkbenchStatusStrip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Progress: Story = { args: { text: "Loading frames", progress: 0.42 } };
export const Failure: Story = { args: { text: "Kernel disconnected", kind: "error", onDismiss: () => {} } };
