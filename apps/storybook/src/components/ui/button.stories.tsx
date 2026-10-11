import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, fn, userEvent, within } from "storybook/test";
import { AddRegular } from "@fluentui/react-icons";
import { Button } from "@molcrafts/design";
import { Tooltip, TooltipContent, TooltipTrigger } from "@molcrafts/design";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { docs: { description: { component: 'import { Button } from "@molcrafts/design"' } } },
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
export const WithIcon: Story = { args: { children: <><AddRegular /> Add item</> } };
export const IconOnly: Story = {
  args: { size: "icon", "aria-label": "Add item", children: <AddRegular aria-hidden="true" /> },
  render: (args) => (
    <Tooltip><TooltipTrigger asChild><Button {...args} /></TooltipTrigger><TooltipContent>Add item</TooltipContent></Tooltip>
  ),
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole("button", { name: "Add item" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(await within(canvasElement.ownerDocument.body).findByRole("tooltip")).toHaveTextContent("Add item");
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
const variantLabel = { default: "Primary", destructive: "Destructive", outline: "Outline", secondary: "Secondary", ghost: "Ghost", link: "Link" } as const;
export const Variants: Story = {
  render: (args) => (
    <div className="max-w-xl space-y-3">
      <p className="text-body text-muted-foreground">Primary is the recommended action. It uses variant="default".</p>
      <div className="flex flex-wrap items-center gap-3">
        {(Object.keys(variantLabel) as (keyof typeof variantLabel)[]).map((variant) => (
          <Button {...args} key={variant} variant={variant}>{variantLabel[variant]}</Button>
        ))}
      </div>
    </div>
  ),
};
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">Compact</Button>
      <Button {...args}>Comfortable default</Button>
      <Button {...args} size="lg">Large</Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button {...args} size="icon" aria-label="Add item"><AddRegular aria-hidden="true" /></Button>
        </TooltipTrigger>
        <TooltipContent>Add item</TooltipContent>
      </Tooltip>
    </div>
  ),
};
export const AsLink: Story = {
  args: { asChild: true, children: <a href="#button-primary-link">Link button</a> },
};
