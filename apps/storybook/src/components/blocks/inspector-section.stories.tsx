import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { InspectorSection } from "@molcrafts/ui";

const meta = {
  title: "Blocks/InspectorSection",
  component: InspectorSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { InspectorSection } from "@molcrafts/ui". A collapsible side-panel group with a subtitle, a badge, and an optional kept-mounted body.',
      },
    },
  },
  args: {
    title: "Selection",
    subtitle: "12 atoms",
    badge: "3",
    defaultOpen: true,
    children: <p className="text-micro text-muted-foreground">The product owns the rows inside.</p>,
  },
} satisfies Meta<typeof InspectorSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Closed: Story = { args: { defaultOpen: false } };
