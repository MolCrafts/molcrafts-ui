import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Button, ConfirmDialog } from "@molcrafts/ui";

const meta = {
  title: "UI/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    docs: {
      description: {
        component:
          'import { ConfirmDialog } from "@molcrafts/ui". Controlled confirmation with a text confirm action; `destructive` marks irreversible actions.',
      },
    },
  },
  args: {
    open: false,
    onOpenChange: () => {},
    title: "Delete frame?",
    description: "The frame and its annotations are removed. This cannot be undone.",
    confirmLabel: "Delete",
    destructive: true,
    onConfirm: () => {},
  },
  render: args => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Delete frame
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} onConfirm={() => setOpen(false)} />
      </>
    );
  },
} satisfies Meta<typeof ConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const NonDestructive: Story = {
  args: { title: "Reload kernel?", description: "Variables in memory are cleared.", confirmLabel: "Reload", destructive: false },
};
