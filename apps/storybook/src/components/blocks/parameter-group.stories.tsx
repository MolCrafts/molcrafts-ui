import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ParameterField, ParameterGroup } from "@molcrafts/ui";

const meta = {
  title: "Blocks/ParameterGroup",
  component: ParameterGroup,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: 'import { ParameterGroup } from "@molcrafts/ui". Titled group of parameter fields.',
      },
    },
  },
  args: {
    title: "Binning",
    children: (
      <>
        <ParameterField field={{ name: "r_max", label: "r_max", unit: "Å", type: "number", default: 12 }} value={12} onChange={() => {}} />
        <ParameterField field={{ name: "bins", label: "bins", type: "integer", default: 200 }} value={200} onChange={() => {}} />
      </>
    ),
  },
} satisfies Meta<typeof ParameterGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
