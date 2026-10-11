import type { ChartTheme, VegaSpec } from "@molcrafts/ui-vega";
import { AXIS, FONT, LINE, MARKER, TYPE, figure, frame, legend, normal, pt, ramp, round, series } from "./acs";

const CONDITIONS = ["A", "B", "C"];
const diameters = normal(240, 34, 8, 7).map(x => ({ x: round(x, 1) }));
const yields = CONDITIONS.flatMap((condition, i) =>
  normal(60, [66, 58, 50][i], [9, 12, 10][i], 11 + i).map(value => ({ condition, value: round(value, 1) })));

export function hist(theme: ChartTheme): VegaSpec {
  return figure({
    data: [{ name: "samples", values: diameters, transform: [
      { type: "bin", field: "x", extent: [10, 60], step: 5 },
      { type: "aggregate", groupby: ["bin0", "bin1"], ops: ["count"], as: ["count"] },
    ] }],
    scales: [
      { name: "x", type: "linear", domain: [10, 60], range: "width" },
      { name: "y", type: "linear", domain: { data: "samples", field: "count" }, range: "height", nice: true, zero: true },
    ],
    axes: frame(theme, "x", "y", "Diameter (nm)", "Count"),
    marks: [{ type: "rect", from: { data: "samples" }, encode: { enter: {
      x: { scale: "x", field: "bin0" }, x2: { scale: "x", field: "bin1" },
      y: { scale: "y", field: "count" }, y2: { scale: "y", value: 0 },
      fill: { value: theme.primary }, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
    } } }],
  });
}

/** Whiskers reach the furthest sample within 1.5 IQR; the rest are fliers, as in Matplotlib. */
export function boxplot(theme: ChartTheme): VegaSpec {
  const fence = () => ({ type: "lookup" as const, from: "quartiles", key: "condition", fields: ["condition"], values: ["low", "high"] });
  const center = { scale: "x", field: "condition", band: 0.5 };
  return figure({
    data: [
      { name: "samples", values: yields },
      { name: "quartiles", source: "samples", transform: [
        { type: "aggregate", groupby: ["condition"], fields: ["value", "value", "value"], ops: ["q1", "median", "q3"], as: ["q1", "median", "q3"] },
        { type: "formula", as: "low", expr: "datum.q1 - 1.5 * (datum.q3 - datum.q1)" },
        { type: "formula", as: "high", expr: "datum.q3 + 1.5 * (datum.q3 - datum.q1)" },
      ] },
      { name: "whiskers", source: "samples", transform: [
        fence(), { type: "filter", expr: "datum.value >= datum.low && datum.value <= datum.high" },
        { type: "aggregate", groupby: ["condition"], fields: ["value", "value"], ops: ["min", "max"], as: ["min", "max"] },
      ] },
      { name: "fliers", source: "samples", transform: [
        fence(), { type: "filter", expr: "datum.value < datum.low || datum.value > datum.high" },
      ] },
    ],
    scales: [
      { name: "x", type: "band", domain: CONDITIONS, range: "width", padding: 0.5 },
      { name: "y", type: "linear", domain: [0, 100], range: "height" },
    ],
    axes: frame(theme, "x", "y", "Condition", "Yield (%)"),
    marks: [
      { type: "rule", from: { data: "whiskers" }, encode: { enter: {
        x: center, y: { scale: "y", field: "min" }, y2: { scale: "y", field: "max" },
        stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
      } } },
      ...(["min", "max"] as const).map(end => ({ type: "rule" as const, from: { data: "whiskers" }, encode: { enter: {
        x: { scale: "x", field: "condition", band: 0.25 }, x2: { scale: "x", field: "condition", band: 0.75 },
        y: { scale: "y", field: end }, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
      } } })),
      { type: "rect", from: { data: "quartiles" }, encode: { enter: {
        x: { scale: "x", field: "condition" }, width: { scale: "x", band: 1 },
        y: { scale: "y", field: "q3" }, y2: { scale: "y", field: "q1" },
        fill: { value: theme.background }, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
      } } },
      { type: "rule", from: { data: "quartiles" }, encode: { enter: {
        x: { scale: "x", field: "condition" }, x2: { scale: "x", field: "condition", band: 1 },
        y: { scale: "y", field: "median" }, stroke: { value: theme.primary }, strokeWidth: { value: LINE },
      } } },
      { type: "symbol", from: { data: "fliers" }, encode: { enter: {
        x: center, y: { scale: "y", field: "value" }, size: { value: MARKER },
        fill: { value: "transparent" }, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
      } } },
    ],
  });
}

export function errorbar(theme: ChartTheme): VegaSpec {
  const values = [25, 40, 55, 70].map((x, i) => ({
    x, y: [0.8, 1.6, 2.9, 4.2][i], xerr: 2, yerr: [0.2, 0.3, 0.4, 0.5][i],
  }));
  const bar = (encode: Record<string, unknown>) =>
    ({ type: "rule" as const, from: { data: "points" }, encode: { enter: { ...encode, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS } } } });
  const cap = pt(2.5);
  return figure({
    data: [{ name: "points", values, transform: [
      { type: "formula", as: "x0", expr: "datum.x - datum.xerr" }, { type: "formula", as: "x1", expr: "datum.x + datum.xerr" },
      { type: "formula", as: "y0", expr: "datum.y - datum.yerr" }, { type: "formula", as: "y1", expr: "datum.y + datum.yerr" },
    ] }],
    scales: [
      { name: "x", type: "linear", domain: [15, 80], range: "width" },
      { name: "y", type: "linear", domain: [0, 6], range: "height" },
    ],
    axes: frame(theme, "x", "y", "Temperature (°C)", "Rate constant (s⁻¹)"),
    marks: [
      bar({ x: { scale: "x", field: "x" }, y: { scale: "y", field: "y0" }, y2: { scale: "y", field: "y1" } }),
      bar({ x: { scale: "x", field: "x0" }, x2: { scale: "x", field: "x1" }, y: { scale: "y", field: "y" } }),
      ...["y0", "y1"].map(field => bar({
        x: { scale: "x", field: "x", offset: -cap }, x2: { scale: "x", field: "x", offset: cap }, y: { scale: "y", field },
      })),
      ...["x0", "x1"].map(field => bar({
        x: { scale: "x", field }, y: { scale: "y", field: "y", offset: -cap }, y2: { scale: "y", field: "y", offset: cap },
      })),
      { type: "symbol", from: { data: "points" }, encode: { enter: {
        x: { scale: "x", field: "x" }, y: { scale: "y", field: "y" }, size: { value: MARKER },
        fill: { value: theme.primary }, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
      } } },
    ],
  });
}

export function violinplot(theme: ChartTheme): VegaSpec {
  return figure({
    data: [
      { name: "samples", values: yields },
      { name: "density", source: "samples", transform: [
        { type: "kde", field: "value", groupby: ["condition"], resolve: "independent", bandwidth: 5, steps: 80, as: ["value", "density"] },
      ] },
    ],
    scales: [
      { name: "x", type: "band", domain: CONDITIONS, range: "width", padding: 0.15 },
      { name: "y", type: "linear", domain: [0, 100], range: "height" },
      { name: "width", type: "linear", domain: { data: "density", field: "density" }, range: [0, { signal: "bandwidth('x') / 2" }] },
    ],
    axes: frame(theme, "x", "y", "Condition", "Yield (%)"),
    marks: [{
      type: "group",
      from: { facet: { name: "violin", data: "density", groupby: "condition" } },
      encode: { enter: { x: { scale: "x", field: "condition" }, width: { scale: "x", band: 1 }, height: { signal: "height" } } },
      marks: [{ type: "area", from: { data: "violin" }, encode: { enter: {
        orient: { value: "horizontal" },
        y: { scale: "y", field: "value" },
        x: { signal: "bandwidth('x') / 2 - scale('width', datum.density)" },
        x2: { signal: "bandwidth('x') / 2 + scale('width', datum.density)" },
        fill: { value: theme.primary }, fillOpacity: { value: 0.35 },
        stroke: { value: theme.primary }, strokeWidth: { value: AXIS },
      } } }],
    }],
  });
}

export function eventplot(theme: ChartTheme): VegaSpec {
  const channels = ["1", "2", "3"];
  const values = channels.flatMap((channel, i) =>
    normal(18, [3, 5, 7][i], 1.2, 23 + i).map(x => ({ channel, x: round(x, 2) })));
  return figure({
    data: [{ name: "events", values }],
    scales: [
      { name: "x", type: "linear", domain: [0, 10], range: "width" },
      { name: "y", type: "band", domain: channels, range: "height", padding: 0.25 },
    ],
    axes: frame(theme, "x", "y", "Time (ms)", "Channel"),
    marks: [{ type: "rule", from: { data: "events" }, encode: { enter: {
      x: { scale: "x", field: "x" }, y: { scale: "y", field: "channel" }, y2: { scale: "y", field: "channel", band: 1 },
      stroke: { value: theme.primary }, strokeWidth: { value: LINE },
    } } }],
  });
}

export function hist2d(theme: ChartTheme): VegaSpec {
  const xs = normal(800, 0, 1, 31);
  const ys = normal(800, 0, 1, 37);
  const values = xs.map((x, i) => ({ x: round(x), y: round(0.6 * x + 0.8 * ys[i]) }));
  return figure({
    data: [{ name: "samples", values, transform: [
      { type: "bin", field: "x", extent: [-3, 3], step: 0.5, as: ["x0", "x1"] },
      { type: "bin", field: "y", extent: [-3, 3], step: 0.5, as: ["y0", "y1"] },
      { type: "aggregate", groupby: ["x0", "x1", "y0", "y1"], ops: ["count"], as: ["count"] },
    ] }],
    scales: [
      { name: "x", type: "linear", domain: [-3, 3], range: "width" },
      { name: "y", type: "linear", domain: [-3, 3], range: "height" },
      { name: "color", type: "linear", domain: { data: "samples", field: "count" }, range: ramp(theme), zero: true },
    ],
    axes: frame(theme, "x", "y", "Shift x (Å)", "Shift y (Å)"),
    legends: [legend(theme, { fill: "color", title: "Count", orient: "right", gradientLength: pt(60), gradientThickness: pt(6) })],
    marks: [{ type: "rect", from: { data: "samples" }, encode: { enter: {
      x: { scale: "x", field: "x0" }, x2: { scale: "x", field: "x1" },
      y: { scale: "y", field: "y0" }, y2: { scale: "y", field: "y1" },
      fill: { scale: "color", field: "count" },
    } } }],
  });
}

export function pie(theme: ChartTheme): VegaSpec {
  const phases = ["Anatase", "Rutile", "Brookite"];
  return figure({
    data: [{ name: "slices", values: phases.map((phase, i) => ({ phase, x: [62, 30, 8][i] })), transform: [
      { type: "pie", field: "x", startAngle: Math.PI / 2, endAngle: Math.PI / 2 - 2 * Math.PI, sort: false },
    ] }],
    scales: [{ name: "color", type: "ordinal", domain: phases, range: series(theme) }],
    signals: [{ name: "radius", update: "min(width, height) / 2 - 2 * " + TYPE }],
    marks: [
      { type: "arc", from: { data: "slices" }, encode: { enter: {
        x: { signal: "width / 2" }, y: { signal: "height / 2" }, outerRadius: { signal: "radius" },
        startAngle: { field: "startAngle" }, endAngle: { field: "endAngle" },
        fill: { scale: "color", field: "phase" }, stroke: { value: theme.background }, strokeWidth: { value: AXIS },
      } } },
      { type: "text", from: { data: "slices" }, encode: { enter: {
        x: { signal: "width / 2" }, y: { signal: "height / 2" },
        radius: { signal: `radius + ${pt(4)}` }, theta: { signal: "(datum.startAngle + datum.endAngle) / 2" },
        text: { signal: "datum.phase + ' ' + datum.x + '%'" }, baseline: { value: "middle" },
        align: { signal: "sin((datum.startAngle + datum.endAngle) / 2) > 0.2 ? 'left' : sin((datum.startAngle + datum.endAngle) / 2) < -0.2 ? 'right' : 'center'" },
        font: { value: FONT }, fontSize: { value: TYPE }, fill: { value: theme.foreground },
      } } },
    ],
  });
}

export function ecdf(theme: ChartTheme): VegaSpec {
  return figure({
    data: [{ name: "samples", values: diameters, transform: [
      { type: "window", sort: { field: "x" }, ops: ["cume_dist"], as: ["y"] },
    ] }],
    scales: [
      { name: "x", type: "linear", domain: [10, 60], range: "width" },
      { name: "y", type: "linear", domain: [0, 1], range: "height" },
    ],
    axes: frame(theme, "x", "y", "Diameter (nm)", "Cumulative fraction"),
    marks: [{ type: "line", from: { data: "samples" }, sort: { field: "datum.x" }, encode: { enter: {
      x: { scale: "x", field: "x" }, y: { scale: "y", field: "y" }, interpolate: { value: "step-after" },
      stroke: { value: theme.primary }, strokeWidth: { value: LINE },
    } } }],
  });
}
