import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Field, Input } from "@molcrafts/ui";

const meta = {
  title: "Blocks/Field",
  component: Field,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { Field } from "@molcrafts/ui". Label, unit, control, and one caption. The control keeps its own accessible name.',
      },
    },
  },
  args: {
    label: "r_max",
    unit: "Å",
    caption: "default 12",
    children: <Input aria-label="r_max" defaultValue="12" className="h-control-compact" />,
  },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
