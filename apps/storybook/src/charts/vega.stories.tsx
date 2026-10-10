import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { VegaView, type VegaSpec } from "@molcrafts/design-vega";
import { ThemeScope } from "@molcrafts/design";
const spec: VegaSpec = {
  autosize: { type: "fit", contains: "padding" },
  data: [{ name: "points", values: [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 3 }] }],
  scales: [{ name: "x", type: "linear", domain: [0, 4], range: "width" }, { name: "y", type: "linear", domain: [0, 5], range: "height" }],
  axes: [{ scale: "x", orient: "bottom" }, { scale: "y", orient: "left" }],
  marks: [{ type: "symbol", from: { data: "points" }, encode: { enter: { x: { scale: "x", field: "x" }, y: { scale: "y", field: "y" }, size: { value: 80 }, fill: { value: "steelblue" } } } }],
};
const meta = { title: "Charts/VegaView", component: VegaView, tags: ["autodocs"], args: { label: "Native measurements", description: "Observed values: 2, 4, 3.", spec, height: 200 }, parameters: { layout: "padded" } } satisfies Meta<typeof VegaView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Canvas: Story = { args: { renderer: "canvas" } };
export const Loading: Story = { args: { loading: true } };
export const Empty: Story = { args: { empty: true } };
export const Invalid: Story = { args: { spec: { signals: [{ name: "bad", update: "missingFunction()" }] } } };
export const Dark: Story = { decorators: [Story => <ThemeScope theme="dark"><Story /></ThemeScope>] };
