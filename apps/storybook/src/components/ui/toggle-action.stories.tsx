import { GridRegular } from "@fluentui/react-icons";
import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ToggleAction } from "@molcrafts/ui";

const meta = {
  title: "UI/ToggleAction",
  component: ToggleAction,
  parameters: {
    docs: {
      description: {
        component:
          'import { ToggleAction } from "@molcrafts/ui". Text button with a pressed state (`aria-pressed`) driven by `selected`.',
      },
    },
  },
  args: { selected: false },
  render: args => {
    const [selected, setSelected] = useState(args.selected);
    return (
      <ToggleAction {...args} selected={selected} onClick={() => setSelected(value => !value)}>
        <GridRegular />
        Grid
      </ToggleAction>
    );
  },
} satisfies Meta<typeof ToggleAction>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
