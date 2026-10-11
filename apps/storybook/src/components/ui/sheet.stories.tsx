import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@molcrafts/design";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: { docs: { description: { component: 'import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="secondary">Open panel</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Panel</SheetTitle>
          <SheetDescription>Close returns you to the page.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
