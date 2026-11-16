import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { NodeInspectorRow } from "@molcrafts/ui";

const meta = {
  title: "Blocks/NodeInspectorRow",
  component: NodeInspectorRow,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { NodeInspectorRow } from "@molcrafts/ui". One label/value pair in a node inspector; `mono` is for identifiers and paths.',
      },
    },
  },
  args: { label: "Task type", value: "compute.rdf" },
} satisfies Meta<typeof NodeInspectorRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Mono: Story = { args: { label: "Node id", value: "n_7f3a21", mono: true } };
