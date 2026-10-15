import { PlayRegular, SettingsRegular } from "@fluentui/react-icons";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import {
  WorkbenchAction,
  WorkbenchDismissAction,
  WorkbenchIconAction,
  WorkbenchRetryAction,
  WorkbenchToggleAction,
} from "@molcrafts/ui";

const meta = {
  title: "Blocks/WorkbenchAction",
  component: WorkbenchAction,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { WorkbenchAction, WorkbenchIconAction, WorkbenchRetryAction, WorkbenchDismissAction, WorkbenchToggleAction } from "@molcrafts/ui". Workbench command buttons by kind and size.',
      },
    },
  },
  args: { kind: "primary", icon: <PlayRegular />, children: "Run" },
} satisfies Meta<typeof WorkbenchAction>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Kinds: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <WorkbenchAction kind="primary">Run</WorkbenchAction>
      <WorkbenchAction kind="secondary">Save</WorkbenchAction>
      <WorkbenchAction kind="ghost">Cancel</WorkbenchAction>
      <WorkbenchAction kind="danger">Delete</WorkbenchAction>
      <WorkbenchAction kind="link">Open log</WorkbenchAction>
    </div>
  ),
};
export const IconActions: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <WorkbenchIconAction label="Settings">
        <SettingsRegular />
      </WorkbenchIconAction>
      <WorkbenchRetryAction />
      <WorkbenchDismissAction />
      <WorkbenchToggleAction pressed label="Follow output">
        <PlayRegular />
      </WorkbenchToggleAction>
    </div>
  ),
};
