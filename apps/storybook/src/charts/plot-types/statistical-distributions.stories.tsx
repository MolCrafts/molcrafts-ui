import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { VegaView } from "@molcrafts/ui-vega";
import { boxplot, ecdf, errorbar, eventplot, hist, hist2d, pie, violinplot } from "../figures/statistics";
import { galleryArgs, galleryParameters } from "./gallery";

const meta = {
  title: "Charts/Plot types/Statistical distributions",
  component: VegaView,
  args: { ...galleryArgs, label: "Particle diameter distribution", spec: hist },
  parameters: {
    ...galleryParameters,
    docs: { ...galleryParameters.docs, description: { component: "Plots of the distribution of at least one variable in a dataset. Some of these methods also compute the distributions. ACS single column, 3.33 in." } },
  },
} satisfies Meta<typeof VegaView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Hist: Story = { name: "hist(x)" };
export const Boxplot: Story = { name: "boxplot(X)", args: { label: "Yield by condition", spec: boxplot } };
export const Errorbar: Story = { name: "errorbar(x, y, yerr, xerr)", args: { label: "Rate constant versus temperature", spec: errorbar } };
export const Violinplot: Story = { name: "violinplot(D)", args: { label: "Yield density by condition", spec: violinplot } };
export const Eventplot: Story = { name: "eventplot(D)", args: { label: "Spike times by channel", spec: eventplot } };
export const Hist2d: Story = { name: "hist2d(x, y)", args: { label: "Joint distribution of shifts", spec: hist2d } };
export const Pie: Story = { name: "pie(x)", args: { label: "TiO₂ phase composition", spec: pie } };
export const Ecdf: Story = { name: "ecdf(x)", args: { label: "Cumulative particle diameter", spec: ecdf } };
