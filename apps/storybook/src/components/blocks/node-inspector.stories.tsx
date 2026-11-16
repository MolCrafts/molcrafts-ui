import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { NodeInspector, NodeInspectorRow, NodeInspectorSection, StatusBadge } from "@molcrafts/ui";

const meta = {
  title: "Blocks/NodeInspector",
  component: NodeInspector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { NodeInspector } from "@molcrafts/ui". Selected-node panel: title, status, identity, sections and a footer; `empty` shows the hint instead.',
      },
    },
  },
  args: {
    title: "Radial distribution",
    subtitle: "compute.rdf",
    identity: "n_7f3a21",
    status: <StatusBadge status="completed" />,
    children: (
      <NodeInspectorSection title="Parameters">
        <NodeInspectorRow label="r_max" value="12 Å" />
        <NodeInspectorRow label="bins" value="200" />
      </NodeInspectorSection>
    ),
  },
} satisfies Meta<typeof NodeInspector>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { empty: true, emptyHint: "Select a node to inspect it." } };
