import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { StatusInline } from "@molcrafts/design";

const meta = {
  title: "Blocks/StatusInline",
  component: StatusInline,
  parameters: { layout: "padded", docs: { description: { component: 'import { StatusInline } from "@molcrafts/design". A distribution over statuses in one line. The bar has a text alternative and the legend repeats each count with its word.' } } },
  args: { total: "6 records", segments: [
    { status: "completed", count: 4, label: "completed" },
    { status: "warning", count: 1, label: "warning" },
    { status: "failed", count: 1, label: "failed" },
  ] },
} satisfies Meta<typeof StatusInline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Empty: Story = { args: { total: "0 records", segments: [] } };
