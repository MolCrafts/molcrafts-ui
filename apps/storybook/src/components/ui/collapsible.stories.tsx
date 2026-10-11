import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent, within } from "storybook/test";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@molcrafts/ui";

const meta = {
  title: "UI/Collapsible",
  component: Collapsible,
  parameters: { docs: { description: { component: 'import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@molcrafts/ui"' } } },
} satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Collapsible className="w-80 space-y-2">
      <CollapsibleTrigger>Show notes</CollapsibleTrigger>
      <CollapsibleContent className="text-body text-muted-foreground">Notes stay hidden until you ask for them.</CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Show notes" }));
    await expect(within(canvasElement).getByText("Notes stay hidden until you ask for them.")).toBeVisible();
  },
};
