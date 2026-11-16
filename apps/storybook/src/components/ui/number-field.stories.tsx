import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, fn, userEvent, within } from "storybook/test";
import { Label, NumberField } from "@molcrafts/ui";

const meta = {
  title: "UI/NumberField",
  component: NumberField,
  parameters: { docs: { description: { component: 'import { NumberField } from "@molcrafts/ui"' } } },
  args: { value: 5, min: 0, max: 10, step: 1, onChange: fn() },
  render: function StatefulField(args) {
    const [value, setValue] = useState(args.value);
    return (
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <NumberField {...args} id="amount" aria-describedby="amount-range" value={value} onChange={(next) => { setValue(next); args.onChange(next); }} />
        <p id="amount-range" className="text-label text-muted-foreground">Enter a number from {args.min} to {args.max}.</p>
      </div>
    );
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
