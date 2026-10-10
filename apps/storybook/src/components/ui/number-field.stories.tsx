import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, fn, userEvent, within } from "storybook/test";
import { NumberField } from "@molcrafts/ui";

const meta = {
  title: "UI/NumberField",
  component: NumberField,
  args: { value: 5, min: 0, max: 10, step: 1, onChange: fn(), "aria-label": "Amount" },
  render: function StatefulField(args) {
    const [value, setValue] = useState(args.value);
    return <NumberField {...args} value={value} onChange={(next) => { setValue(next); args.onChange(next); }} />;
  },
} satisfies Meta<typeof NumberField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ClampsOnCommit: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole("spinbutton", { name: "Amount" });
    await userEvent.clear(input);
    await userEvent.type(input, "99{Enter}");
    await expect(input).toHaveValue(10);
    await expect(args.onChange).toHaveBeenLastCalledWith(10);
  },
};
