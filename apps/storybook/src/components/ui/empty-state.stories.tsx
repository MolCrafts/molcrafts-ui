import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { FolderOpenRegular } from "@fluentui/react-icons";
import { EmptyState } from "@molcrafts/design";
import { Button } from "@molcrafts/design";

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  parameters: { docs: { description: { component: 'import { EmptyState } from "@molcrafts/design"' } } },
  args: { title: "No items yet", description: "Create an item to get started.", icon: <FolderOpenRegular />, action: <Button>Create item</Button> },
  argTypes: { density: { control: "select", options: ["default", "compact", "inline"] } },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithAction: Story = { args: { icon: <FolderOpenRegular />, action: <Button>Create item</Button> } };
export const Compact: Story = { args: { density: "compact", icon: undefined, action: undefined } };
export const Inline: Story = { args: { density: "inline", icon: undefined, action: undefined } };
