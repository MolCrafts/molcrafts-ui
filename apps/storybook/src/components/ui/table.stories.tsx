import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@molcrafts/design";

const meta = {
  title: "UI/Table",
  component: Table,
  parameters: { docs: { description: { component: 'import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Workspace</TableCell>
          <TableCell>Running</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Archive</TableCell>
          <TableCell>Completed</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
