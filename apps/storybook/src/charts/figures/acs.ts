import type { ChartTheme, VegaSpec } from "@molcrafts/design-vega";

/**
 * ACS figure rules: single column is 3.33 in wide, lettering is Arial or Helvetica
 * no smaller than 4.5 pt, and lines are no thinner than 0.5 pt. Figures keep the
 * Matplotlib 4:3 default aspect and are drawn at twice print size for the screen.
 */
const SCREEN_SCALE = 2;
const PX_PER_PT = (96 / 72) * SCREEN_SCALE;
export const pt = (points: number) => points * PX_PER_PT;

export const FIGURE_WIDTH = Math.round(3.33 * 72 * PX_PER_PT);
export const FIGURE_HEIGHT = Math.round(FIGURE_WIDTH * 3 / 4);

export const FONT = "Arial, Helvetica, sans-serif";
export const TYPE = pt(7);
export const AXIS = pt(0.75);
export const LINE = pt(1.25);
/** Vega symbol size is an area. This is a 4 pt circle. */
export const MARKER = Math.round(Math.PI * pt(2) ** 2);

type Axis = NonNullable<VegaSpec["axes"]>[number];
type Legend = NonNullable<VegaSpec["legends"]>[number];

/** Series colors come from the product brand, then fall back to the text color. */
export const series = (theme: ChartTheme) => [theme.primary, theme.secondary, theme.mutedForeground];

/** One sequential ramp from the surface to the primary color. */
export const ramp = (theme: ChartTheme) => [theme.background, theme.primary];

export function axis(theme: ChartTheme, spec: Axis): Axis {
  return {
    labelColor: theme.foreground,
    titleColor: theme.foreground,
    domainColor: theme.foreground,
    tickColor: theme.foreground,
    labelFont: FONT,
    titleFont: FONT,
    labelFontSize: TYPE,
    titleFontSize: TYPE,
    labelFontWeight: 400,
    titleFontWeight: 400,
    domainWidth: AXIS,
    tickWidth: AXIS,
    tickSize: pt(3.5),
    tickCount: 5,
    labelPadding: pt(2),
    titlePadding: pt(3),
    labelFlush: false,
    grid: false,
    ...spec,
  };
}

/** Four spines and two labelled axes, as in a default Matplotlib Axes. */
export function frame(theme: ChartTheme, x: string, y: string, xTitle: string, yTitle: string): Axis[] {
  const spine = { labels: false, ticks: false };
  return [
    axis(theme, { scale: x, orient: "bottom", title: xTitle }),
    axis(theme, { scale: y, orient: "left", title: yTitle }),
    axis(theme, { scale: x, orient: "top", ...spine }),
    axis(theme, { scale: y, orient: "right", ...spine }),
  ];
}

export function legend(theme: ChartTheme, spec: Legend): Legend {
  return {
    orient: "top-left",
    offset: pt(4),
    symbolSize: MARKER,
    symbolStrokeColor: theme.foreground,
    symbolStrokeWidth: AXIS,
    labelColor: theme.foreground,
    titleColor: theme.foreground,
    labelFont: FONT,
    titleFont: FONT,
    labelFontSize: TYPE,
    titleFontSize: TYPE,
    titleFontWeight: 400,
    ...spec,
  };
}

export function figure(spec: Omit<VegaSpec, "background" | "autosize" | "padding">): VegaSpec {
  return {
    background: "transparent",
    autosize: { type: "fit", contains: "padding" },
    padding: pt(4),
    ...spec,
  };
}

/** Deterministic samples so every render and screenshot draws the same figure. */
export function normal(count: number, mean: number, deviation: number, seed: number): number[] {
  let state = seed >>> 0;
  const uniform = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return (state + 1) / 4294967297;
  };
  return Array.from({ length: count }, () =>
    mean + deviation * Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform()));
}

export const round = (value: number, digits = 2) => Number(value.toFixed(digits));
