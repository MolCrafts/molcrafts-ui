import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent, within } from "storybook/test";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button,
} from "@molcrafts/design";

const meta = {
  title: "UI/AlertDialog",
  component: AlertDialog,
  parameters: { docs: { description: { component: 'import { AlertDialog, AlertDialogAction, AlertDialogCancel } from "@molcrafts/design"' } } },
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="destructive">Delete item</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>This removes the item. Cancel keeps it.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction intent="danger">Delete item</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Danger: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Delete item" }));
    const dialog = await body.findByRole("alertdialog", { name: "Delete this item?" });
    await expect(within(dialog).getByRole("button", { name: "Delete item" })).toBeVisible();
    await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
    await expect(body.queryByRole("alertdialog")).not.toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Delete item" })).toHaveFocus();
  },
};
