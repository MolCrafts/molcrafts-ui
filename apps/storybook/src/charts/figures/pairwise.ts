import type { ChartTheme, VegaSpec } from "@molcrafts/ui-vega";
import { AXIS, LINE, MARKER, figure, frame, legend, series } from "./acs";

const xy = { x: { scale: "x", field: "x" }, y: { scale: "y", field: "y" } };

export function plot(theme: ChartTheme): VegaSpec {
  const values = [0, 10, 20, 30, 40, 50].map((x, i) => ({ x, y: [4, 18, 41, 63, 78, 86][i] }));
  return figure({
    data: [{ name: "points", values }],
    scales: [
      { name: "x", type: "linear", domain: [0, 50], range: "width" },
      { name: "y", type: "linear", domain: [0, 100], range: "height" },
    ],
    axes: frame(theme, "x", "y", "Time (min)", "Yield (%)"),
    marks: [
      { type: "line", from: { data: "points" }, encode: { enter: {
        ...xy, stroke: { value: theme.primary }, strokeWidth: { value: LINE },
      } } },
      { type: "symbol", from: { data: "points" }, encode: { enter: {
        ...xy, size: { value: MARKER }, fill: { value: theme.primary },
        stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
      } } },
    ],
  });
}

export function scatter(theme: ChartTheme): VegaSpec {
  const slopes = { A: 0.59, B: 0.36 };
  const values = Object.entries(slopes).flatMap(([name, slope]) =>
    [0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((x, i) => ({ series: name, x, y: slope * x + [0.01, -0.02, 0.02, -0.01, 0.015, -0.015][i] })));
  return figure({
    data: [{ name: "points", values }],
    scales: [
      { name: "x", type: "linear", domain: [0, 1], range: "width" },
      { name: "y", type: "linear", domain: [0, 0.6], range: "height" },
      { name: "color", type: "ordinal", domain: ["A", "B"], range: series(theme) },
      { name: "shape", type: "ordinal", domain: ["A", "B"], range: ["circle", "square"] },
    ],
    axes: frame(theme, "x", "y", "Concentration (mM)", "Absorbance"),
    legends: [legend(theme, { fill: "color", shape: "shape" })],
    marks: [{ type: "symbol", from: { data: "points" }, encode: { enter: {
      ...xy, size: { value: MARKER }, shape: { scale: "shape", field: "series" },
      fill: { scale: "color", field: "series" }, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
    } } }],
  });
}

export function bar(theme: ChartTheme): VegaSpec {
  const catalysts = ["Pd", "Ni", "Cu", "Fe"];
  return figure({
    data: [{ name: "bars", values: catalysts.map((x, i) => ({ x, height: [92, 74, 61, 38][i] })) }],
    scales: [
      { name: "x", type: "band", domain: catalysts, range: "width", padding: 0.2 },
      { name: "y", type: "linear", domain: [0, 100], range: "height" },
    ],
    axes: frame(theme, "x", "y", "Catalyst", "Yield (%)"),
    marks: [{ type: "rect", from: { data: "bars" }, encode: { enter: {
      x: { scale: "x", field: "x" }, width: { scale: "x", band: 1 },
      y: { scale: "y", field: "height" }, y2: { scale: "y", value: 0 },
      fill: { value: theme.primary }, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
    } } }],
  });
}

export function stem(theme: ChartTheme): VegaSpec {
  const values = [77, 91, 105, 120, 152].map((x, i) => ({ x, y: [28, 46, 100, 18, 62][i] }));
  return figure({
    data: [{ name: "peaks", values }],
    scales: [
      { name: "x", type: "linear", domain: [50, 180], range: "width" },
      { name: "y", type: "linear", domain: [0, 110], range: "height" },
    ],
    axes: frame(theme, "x", "y", "m/z", "Relative intensity (%)"),
    marks: [
      { type: "rule", encode: { enter: {
        x: { value: 0 }, x2: { signal: "width" }, y: { scale: "y", value: 0 },
        stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
      } } },
      { type: "rule", from: { data: "peaks" }, encode: { enter: {
        ...xy, y2: { scale: "y", value: 0 }, stroke: { value: theme.primary }, strokeWidth: { value: LINE },
      } } },
      { type: "symbol", from: { data: "peaks" }, encode: { enter: {
        ...xy, size: { value: MARKER }, fill: { value: theme.primary },
        stroke: { value: theme.foreground }, strokeWidth: { value: AXIS },
      } } },
    ],
  });
}

export function fillBetween(theme: ChartTheme): VegaSpec {
  const values = [0, 10, 20, 30, 40].map((x, i) => ({
    x, y1: [8, 18, 30, 36, 40][i], y: [12, 24, 40, 48, 52][i], y2: [16, 31, 49, 58, 63][i],
  }));
  return figure({
    data: [{ name: "band", values }],
    scales: [
      { name: "x", type: "linear", domain: [0, 40], range: "width" },
      { name: "y", type: "linear", domain: [0, 80], range: "height" },
    ],
    axes: frame(theme, "x", "y", "Time (min)", "Signal (mV)"),
    marks: [
      { type: "area", from: { data: "band" }, encode: { enter: {
        x: { scale: "x", field: "x" }, y: { scale: "y", field: "y2" }, y2: { scale: "y", field: "y1" },
        fill: { value: theme.primary }, fillOpacity: { value: 0.25 },
      } } },
      { type: "line", from: { data: "band" }, encode: { enter: {
        ...xy, stroke: { value: theme.primary }, strokeWidth: { value: LINE },
      } } },
    ],
  });
}

export function stackplot(theme: ChartTheme): VegaSpec {
  const species = ["Reactant", "Intermediate", "Product"];
  const values = [0, 5, 10, 15, 20, 25, 30].flatMap(x => {
    const reactant = 100 * Math.exp(-x / 8);
    const product = 100 * (1 - Math.exp(-x / 14));
    const shares = [reactant, Math.max(0, 100 - reactant - product), product];
    return species.map((name, i) => ({ x, series: name, y: shares[i] }));
  });
  return figure({
    data: [{ name: "shares", values, transform: [
      { type: "formula", as: "layer", expr: `indexof(${JSON.stringify(species)}, datum.series)` },
      { type: "stack", groupby: ["x"], sort: { field: "layer" }, field: "y" },
    ] }],
    scales: [
      { name: "x", type: "linear", domain: [0, 30], range: "width" },
      { name: "y", type: "linear", domain: [0, 100], range: "height" },
      { name: "color", type: "ordinal", domain: species, range: series(theme) },
    ],
    axes: frame(theme, "x", "y", "Time (min)", "Mole fraction (%)"),
    legends: [legend(theme, { fill: "color", orient: "right", symbolType: "square", symbolStrokeWidth: 0 })],
    marks: [{
      type: "group",
      from: { facet: { name: "layer", data: "shares", groupby: "series" } },
      marks: [{ type: "area", from: { data: "layer" }, encode: { enter: {
        x: { scale: "x", field: "x" }, y: { scale: "y", field: "y0" }, y2: { scale: "y", field: "y1" },
        fill: { scale: "color", field: "series" },
        stroke: { value: theme.foreground }, strokeWidth: { value: AXIS / 2 },
      } } }],
    }],
  });
}

export function stairs(theme: ChartTheme): VegaSpec {
  const edges = [0, 1, 2, 3, 4, 5, 6, 7];
  const levels = [2, 5, 9, 7, 4, 6, 3];
  const values = edges.map((x, i) => ({ x, y: levels[Math.min(i, levels.length - 1)] }));
  return figure({
    data: [{ name: "steps", values }],
    scales: [
      { name: "x", type: "linear", domain: [0, 7], range: "width" },
      { name: "y", type: "linear", domain: [0, 10], range: "height" },
    ],
    axes: frame(theme, "x", "y", "Fraction", "Concentration (µM)"),
    marks: [{ type: "line", from: { data: "steps" }, encode: { enter: {
      ...xy, interpolate: { value: "step-after" }, stroke: { value: theme.primary }, strokeWidth: { value: LINE },
    } } }],
  });
}
