import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Badge } from "@molcrafts/ui";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: { docs: { description: { component: 'import { Badge } from "@molcrafts/ui". secondary is the neutral badge. A product secondary brand is a separate swatch.' } } },
  args: { children: "Badge" },
  argTypes: { variant: { control: "select", options: ["default", "secondary", "destructive", "outline", "success", "warning", "info"] } },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Variants: Story = {
  render: (args) => (
    <div className="max-w-xl space-y-3">
      <p className="text-body text-muted-foreground">Status badges keep a readable word. secondary is the neutral badge, separate from a product secondary brand.</p>
      <div className="flex flex-wrap gap-3">
        {(["default", "secondary", "destructive", "outline", "success", "warning", "info"] as const).map((variant) => (
          <Badge {...args} key={variant} variant={variant}>{variant === "success" ? "Completed" : variant === "warning" ? "Warning" : variant === "destructive" ? "Failed" : variant === "info" ? "Running" : variant}</Badge>
        ))}
      </div>
    </div>
  ),
};
