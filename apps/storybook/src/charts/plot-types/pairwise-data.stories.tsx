import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { VegaView } from "@molcrafts/ui-vega";
import { bar, fillBetween, plot, scatter, stackplot, stairs, stem } from "../figures/pairwise";
import { galleryArgs, galleryParameters } from "./gallery";

const meta = {
  title: "Charts/Plot types/Pairwise data",
  component: VegaView,
  args: { ...galleryArgs, label: "Yield versus time", spec: plot },
  parameters: {
    ...galleryParameters,
    docs: { ...galleryParameters.docs, description: { component: "Plots of pairwise (x, y), tabular (var_0, ⋯, var_n), and functional f(x) = y data. ACS single column, 3.33 in." } },
  },
} satisfies Meta<typeof VegaView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plot: Story = { name: "plot(x, y)" };
export const Scatter: Story = { name: "scatter(x, y)", args: { label: "Absorbance versus concentration", spec: scatter } };
export const Bar: Story = { name: "bar(x, height)", args: { label: "Yield by catalyst", spec: bar } };
export const Stem: Story = { name: "stem(x, y)", args: { label: "Mass spectrum", spec: stem } };
export const FillBetween: Story = { name: "fill_between(x, y1, y2)", args: { label: "Signal with its uncertainty band", spec: fillBetween } };
export const Stackplot: Story = { name: "stackplot(x, y)", args: { label: "Species mole fraction versus time", spec: stackplot } };
export const Stairs: Story = { name: "stairs(values)", args: { label: "Concentration by fraction", spec: stairs } };
