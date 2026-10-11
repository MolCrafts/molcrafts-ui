import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "@molcrafts/design";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@molcrafts/design";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: { docs: { description: { component: 'import { Dialog } from "@molcrafts/design"' } } },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Confirm changes</DialogTitle><DialogDescription>Review your changes before saving.</DialogDescription></DialogHeader>
        <p className="text-body">This preview uses the shared overlay and typography tokens.</p>
        <DialogFooter>
          <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const OpenAndClose: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    await expect(await body.findByRole("dialog", { name: "Confirm changes" })).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open dialog" })).toHaveFocus();
  },
};
