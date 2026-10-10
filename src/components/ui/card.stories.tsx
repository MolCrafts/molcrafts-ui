import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
import { ProgressSpinner } from "./progress-spinner";

const meta = {
  title: "UI/Card",
  component: Card,
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader><CardTitle>Workspace</CardTitle><CardDescription>Shared component preview</CardDescription></CardHeader>
      <CardContent><p className="text-body">A neutral surface using the MolCrafts visual constitution.</p></CardContent>
      <CardFooter><Button>Continue</Button></CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Loading: Story = {
  render: () => (
    <Card className="w-80"><CardHeader><Skeleton className="h-5 w-32" /><Skeleton className="h-4 w-48" /></CardHeader>
      <CardContent className="flex items-center gap-2"><ProgressSpinner /><span className="text-body">Loading…</span></CardContent>
    </Card>
  ),
};
