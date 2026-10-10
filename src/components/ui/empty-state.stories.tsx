import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "./empty-state";
import { Button } from "./button";

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  args: { title: "No items yet", description: "Create an item to get started." },
  argTypes: { density: { control: "select", options: ["default", "compact", "inline"] } },
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithAction: Story = { args: { icon: <FolderOpen />, action: <Button>Create item</Button> } };
export const Compact: Story = { args: { density: "compact" } };
export const Inline: Story = { args: { density: "inline" } };
