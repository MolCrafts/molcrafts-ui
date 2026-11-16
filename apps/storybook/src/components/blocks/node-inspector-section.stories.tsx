import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { NodeInspectorRow, NodeInspectorSection } from "@molcrafts/ui";

const meta = {
  title: "Blocks/NodeInspectorSection",
  component: NodeInspectorSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { NodeInspectorSection } from "@molcrafts/ui". Titled group of inspector rows.',
      },
    },
  },
  args: {
    title: "Run",
    children: (
      <>
        <NodeInspectorRow label="Started" value="12:04:31" />
        <NodeInspectorRow label="Duration" value="1.2 s" />
      </>
    ),
  },
} satisfies Meta<typeof NodeInspectorSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
