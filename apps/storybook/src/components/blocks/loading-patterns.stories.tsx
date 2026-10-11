import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { BandSkeleton, RowsSkeleton } from "@molcrafts/design";

const meta = {
  title: "Blocks/Loading patterns",
  component: BandSkeleton,
  parameters: { layout: "padded", docs: { description: { component: 'import { BandSkeleton, RowsSkeleton } from "@molcrafts/design". Skeletons shaped like MetaStrip, MeasureBand, and table rows. They are aria-hidden: announce loading from the surrounding region.' } } },
} satisfies Meta<typeof BandSkeleton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Facts: Story = {};
export const Measures: Story = { args: { variant: "measures" } };
export const Rows: Story = { render: () => <RowsSkeleton /> };
export const Lines: Story = { render: () => <RowsSkeleton density="line" className="w-80" /> };
