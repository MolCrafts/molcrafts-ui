import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@molcrafts/ui";

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: { docs: { description: { component: 'import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@molcrafts/ui"' } } },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { type: "single", collapsible: true },
  render: () => (
    <Accordion type="single" collapsible className="w-80">
      <AccordionItem value="geometry">
        <AccordionTrigger>Geometry</AccordionTrigger>
        <AccordionContent>Spacing, radius, and the 40px control default.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="color">
        <AccordionTrigger>Color</AccordionTrigger>
        <AccordionContent>Products supply both brand families. Status colors stay shared.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
