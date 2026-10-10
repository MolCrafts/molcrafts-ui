import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Badge } from "@molcrafts/ui";

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: { children: "Badge" },
  argTypes: { variant: { control: "select", options: ["default", "secondary", "destructive", "outline", "success", "warning", "info"] } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Variants: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(["default", "secondary", "destructive", "outline", "success", "warning", "info"] as const).map((variant) => (
        <Badge {...args} key={variant} variant={variant}>{variant}</Badge>
      ))}
    </div>
  ),
};
