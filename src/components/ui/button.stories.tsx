import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, fn, userEvent, within } from "storybook/test";
import { Plus } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Button", onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "content", "icon", "icon-sm", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Button" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const WithIcon: Story = { args: { children: <><Plus /> Add item</> } };
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["default", "destructive", "outline", "secondary", "ghost", "link"] as const).map((variant) => (
        <Button {...args} key={variant} variant={variant}>{variant}</Button>
      ))}
    </div>
  ),
};
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Button {...args} size="sm">Compact</Button>
      <Button {...args}>Default</Button>
      <Button {...args} size="lg">Comfortable</Button>
      <Button {...args} size="icon" aria-label="Add item"><Plus /></Button>
    </div>
  ),
};
export const AsLink: Story = {
  args: { asChild: true, children: <a href="#button-link">Link button</a> },
};
