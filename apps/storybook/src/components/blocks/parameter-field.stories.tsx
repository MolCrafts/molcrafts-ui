import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ParameterField, type ParameterFieldDescriptor } from "@molcrafts/ui";

const rMax: ParameterFieldDescriptor = {
  name: "r_max",
  label: "r_max",
  description: "Largest pair distance",
  unit: "Å",
  type: "number",
  default: 12,
  required: true,
};

const meta = {
  title: "Blocks/ParameterField",
  component: ParameterField,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { ParameterField } from "@molcrafts/ui". Renders one typed parameter (number, integer, text, boolean, enum) from its descriptor.',
      },
    },
  },
  args: { field: rMax, value: 12, onChange: () => {} },
  render: args => {
    const [value, setValue] = useState(args.value);
    return <ParameterField {...args} value={value} onChange={setValue} />;
  },
} satisfies Meta<typeof ParameterField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Enum: Story = {
  args: { field: { name: "mode", label: "Mode", type: "enum", default: "xyz", options: ["xyz", "pdb", "lammps"] }, value: "xyz" },
};
export const Toggle: Story = { args: { field: { name: "pbc", label: "Periodic", type: "boolean", default: true }, value: true } };
export const Invalid: Story = { args: { value: -1, error: "Must be positive" } };
