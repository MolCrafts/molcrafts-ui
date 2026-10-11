import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@molcrafts/design";

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: { docs: { description: { component: 'import { Popover, PopoverContent, PopoverTrigger } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="secondary">Details</Button></PopoverTrigger>
      <PopoverContent className="w-64 text-body">The note stays next to the control that opened it.</PopoverContent>
    </Popover>
  ),
};
