import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { AddRegular } from "@fluentui/react-icons";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@molcrafts/design";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: { docs: { description: { component: 'import { Tooltip, TooltipContent, TooltipTrigger } from "@molcrafts/design". The tooltip is visible help. The accessible name stays on the control.' } } },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" aria-label="Add item"><AddRegular aria-hidden="true" /></Button>
      </TooltipTrigger>
      <TooltipContent>Add item</TooltipContent>
    </Tooltip>
  ),
};
