import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { WorkbenchHeartbeat } from "@molcrafts/ui";

const meta = {
  title: "Blocks/WorkbenchHeartbeat",
  component: WorkbenchHeartbeat,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { WorkbenchHeartbeat } from "@molcrafts/ui". Pulses each time `beat` changes; with `onClick` it doubles as a refresh control.',
      },
    },
  },
  args: { beat: 1, label: "Refresh" },
} satisfies Meta<typeof WorkbenchHeartbeat>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Running: Story = { args: { running: true } };
export const Clickable: Story = { args: { onClick: () => {} } };
