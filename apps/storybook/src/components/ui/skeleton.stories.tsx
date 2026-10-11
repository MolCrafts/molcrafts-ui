import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Skeleton } from "@molcrafts/ui";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: { docs: { description: { component: 'import { Skeleton } from "@molcrafts/ui"' } } },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <div className="w-64 space-y-2" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  ),
};
