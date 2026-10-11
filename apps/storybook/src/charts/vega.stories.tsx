import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { VegaView } from "@molcrafts/ui-vega";
import { ThemeScope } from "@molcrafts/ui";
import { FIGURE_HEIGHT, FIGURE_WIDTH } from "./figures/acs";
import { scatter } from "./figures/pairwise";

const meta = {
  title: "Charts/VegaView",
  component: VegaView,
  tags: ["autodocs"],
  args: {
    label: "Absorbance versus concentration",
    spec: scatter,
    width: FIGURE_WIDTH,
    height: FIGURE_HEIGHT,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: 'import { VegaView } from "@molcrafts/ui-vega". Pass an official Vega spec, or spec(theme) so marks inherit semantic color. Only trusted specs: this viewer is not a sandbox. This page is the only one that shows the figure title, caption, and states. Charts/Plot types shows each figure alone, named after the Matplotlib plot-types gallery. label is the visible figure title. description is the caption, shown once the chart is ready and hidden while loading, empty, or failed. viewRef exposes getView, setSignal, setData, exportSVG, and exportImage.',
      },
    },
  },
  argTypes: {
    label: { description: "Required figure title. Visible above the plot and used as the accessible name." },
    labelHidden: { description: "Keeps label as the accessible name without drawing it. Use when the page already titles the figure." },
    description: { description: "Caption, visible once the chart is ready. Hidden during loading, empty, and error. Also linked with aria-describedby." },
    spec: { description: "Official Vega spec, or a stable (theme) => spec factory. Trusted specs only. This viewer is not a sandbox.", control: false },
    height: { description: "Plot height in CSS pixels. The frame grows when a status message needs more room. Default 240." },
    width: { description: "Plot width in CSS pixels. Omit it to follow the container." },
    renderer: { description: "svg (default) or canvas. Canvas paints tick labels into the bitmap.", control: "select", options: ["svg", "canvas"] },
    loading: { description: "Replaces the plot with the loading status and disposes the current view." },
    empty: { description: "Replaces the plot with the empty status and disposes the current view." },
    loadingFallback: { description: "Loading status. Default: Loading chart…", control: "text" },
    emptyFallback: { description: "Empty status. Default: No chart data.", control: "text" },
    errorFallback: { description: "Error alert. Default shows the caught message and tells the reader to check the spec. A function receives the Error.", control: false },
    data: { description: "Named data tables applied in place. Removed keys are not cleared.", control: false },
    signals: { description: "Named signal values applied in place.", control: false },
    signalNames: { description: "Signals reported through onSignalChange.", control: false },
    onSignalChange: { control: false },
    onReady: { description: "Receives the official Vega View once the chart is ready.", control: false },
    onError: { description: "Receives the same Error shown in the alert.", control: false },
    viewRef: { description: "getView, setSignal, setData, exportSVG, and exportImage. Methods reject before ready.", control: false },
  },
} satisfies Meta<typeof VegaView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Title: Story = {};

export const TitleAndCaption: Story = {
  name: "Title and caption",
  args: { description: "Absorbance of A and B rises linearly with concentration. The slope of A is 1.6 times the slope of B." },
};

export const HiddenTitle: Story = {
  name: "Hidden title",
  args: { labelHidden: true },
};

export const Canvas: Story = {
  args: { renderer: "canvas", description: "Canvas renderer. Tick labels are painted, not DOM text." },
};

export const Loading: Story = { args: { loading: true } };

export const Empty: Story = {
  args: { empty: true, emptyFallback: "No rows in this series. Leave empty until the series has values." },
};

function InvalidStory(args: ComponentProps<typeof VegaView>) {
  const [reported, setReported] = useState("Waiting for onError.");
  return <>
    <VegaView {...args} onError={error => setReported(error.message)} />
    <p role="status" style={{ margin: "calc(var(--spacing, 0.25rem) * 2) 0 0", fontSize: "var(--text-body)", lineHeight: "var(--text-body--line-height)" }}>onError: {reported}</p>
  </>;
}

export const ErrorState: Story = {
  name: "Error",
  render: args => <InvalidStory {...args} spec={{ signals: [{ name: "bad", update: "missingFunction()" }] }} />,
};

export const Dark: Story = {
  decorators: [Story => <ThemeScope theme="dark"><Story /></ThemeScope>],
};
