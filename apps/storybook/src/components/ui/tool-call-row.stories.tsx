import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ToolCallRow } from "@molcrafts/ui";

const meta = {
  title: "UI/ToolCallRow",
  component: ToolCallRow,
  parameters: {
    docs: {
      description: {
        component:
          'import { ToolCallRow } from "@molcrafts/ui". One agent tool call: name, status, arguments, summary and duration.',
      },
    },
  },
  args: { name: "compute_rdf", status: "success", args: '{"r_max": 12}', summary: "200 bins", duration: "1.2 s" },
} satisfies Meta<typeof ToolCallRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Running: Story = { args: { status: "running", summary: null, duration: null } };
export const Failed: Story = { args: { status: "failed", summary: "frame 12 is missing box", duration: "0.3 s" } };
