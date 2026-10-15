import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ArcChart, BarChart, Plot } from "@molcrafts/ui-vega";

const meta = {
  title: "Charts/Dashboard",
  component: ArcChart,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "import { ArcChart, BarChart, Plot } from \"@molcrafts/ui-vega\". Arc is a part-to-whole, bar is one magnitude per category, and plot is an ordered series. Pass resolved colors; the chart does not read CSS variables. The page that owns the data picks the component.",
      },
    },
  },
} satisfies Meta<typeof ArcChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Arc: Story = {
  args: {
    label: "Phase fraction",
    height: 220,
    data: [
      { label: "Anatase", value: 62, color: "#2563eb" },
      { label: "Rutile", value: 30, color: "#16a34a" },
      { label: "Brookite", value: 8, color: "#64748b" },
    ],
  },
};

export const Bar: Story = {
  args: { label: "Yield by catalyst", height: 220, data: [] },
  render: () => (
    <BarChart
      label="Yield by catalyst"
      height={220}
      data={[
        { label: "Pd", value: 92 },
        { label: "Ni", value: 74 },
        { label: "Cu", value: 61 },
        { label: "Fe", value: 38 },
      ]}
    />
  ),
};

export const Series: Story = {
  args: { label: "Yield versus time", height: 220, data: [] },
  render: () => (
    <Plot
      label="Yield versus time"
      height={220}
      points={[
        { x: 0, y: 4 },
        { x: 10, y: 18 },
        { x: 20, y: 41 },
        { x: 30, y: 63 },
        { x: 40, y: 78 },
        { x: 50, y: 86 },
      ]}
    />
  ),
};
