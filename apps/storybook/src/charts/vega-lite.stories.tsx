import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { VegaLiteView, type VegaLiteSpec } from "@molcrafts/design-vega-lite";
import { ThemeScope } from "@molcrafts/design";
const spec: VegaLiteSpec = {
  autosize: { type: "fit", contains: "padding" },
  data: { values: [{ step: 1, value: 2 }, { step: 2, value: 4 }, { step: 3, value: 3 }] },
  mark: { type: "line", point: true, tooltip: true },
  encoding: { x: { field: "step", type: "quantitative" }, y: { field: "value", type: "quantitative" } },
};
const meta = { title: "Charts/VegaLiteView", component: VegaLiteView, tags: ["autodocs"], args: { label: "Trend measurements", description: "Values rise from 2 to 4, then fall to 3.", spec, height: 200 }, parameters: { layout: "padded" } } satisfies Meta<typeof VegaLiteView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { decorators: [Story => <ThemeScope theme="dark"><Story /></ThemeScope>] };
export const Bar: Story = { args: { spec: { ...spec, mark: "bar" } } };
export const Sparkline: Story = { args: { height: 72, spec: { ...spec, encoding: { x: { field: "step", type: "quantitative", axis: null }, y: { field: "value", type: "quantitative", axis: null } } } } };
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { empty: true } };
