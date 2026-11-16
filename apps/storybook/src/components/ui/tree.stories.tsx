import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Tree, type TreeNodeProps } from "@molcrafts/ui";

const nodes: TreeNodeProps[] = [
  {
    id: "data",
    name: "data",
    path: "data",
    kind: "folder",
    children: [
      { id: "data/water.pdb", name: "water.pdb", path: "data/water.pdb", kind: "file" },
      { id: "data/traj.xyz", name: "traj.xyz", path: "data/traj.xyz", kind: "file" },
    ],
  },
  { id: "analysis.py", name: "analysis.py", path: "analysis.py", kind: "file" },
];

const meta = {
  title: "UI/Tree",
  component: Tree,
  parameters: {
    docs: {
      description: {
        component:
          'import { Tree, TreeItem } from "@molcrafts/ui". Keyboard-navigable file/folder tree; `renderNode` wraps the default row.',
      },
    },
  },
  args: { nodes, defaultExpandedIds: new Set(["data"]) },
} satisfies Meta<typeof Tree>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Collapsed: Story = { args: { defaultExpandedIds: new Set() } };
