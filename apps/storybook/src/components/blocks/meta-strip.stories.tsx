import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { MeasureBand, MetaStrip } from "@molcrafts/design";

const meta = {
  title: "Blocks/MetaStrip",
  component: MetaStrip,
  parameters: { layout: "padded", docs: { description: { component: 'import { MetaStrip, MeasureBand } from "@molcrafts/design". MetaStrip shows three to eight facts in one band. MeasureBand shows several measures of one thing with meters. Values arrive formatted.' } } },
  args: { facts: [
    { label: "Records", value: 6 },
    { label: "Snapshots", value: 214 },
    { label: "Last published", value: "2 h ago" },
    { label: "Profile", value: "linux-x86_64", mono: true },
  ] },
} satisfies Meta<typeof MetaStrip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Measures: Story = {
  render: () => (
    <MeasureBand measures={[
      { label: "Lines", value: "91.2%", percent: 91.2, tone: "completed" },
      { label: "Branches", value: "74.0%", percent: 74, tone: "warning" },
      { label: "Functions", value: "52.5%", percent: 52.5, tone: "failed" },
      { label: "Files", value: "128" },
    ]} />
  ),
};
