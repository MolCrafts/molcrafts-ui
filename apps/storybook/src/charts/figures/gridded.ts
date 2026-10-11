import type { ChartTheme, VegaSpec } from "@molcrafts/ui-vega";
import { AXIS, LINE, figure, frame, legend, pt, ramp, round } from "./acs";

/** Matplotlib's contour demo surface on [-3, 3] × [-3, 3]. */
const surface = (x: number, y: number) => (1 - x / 2 + x ** 5 + y ** 3) * Math.exp(-(x ** 2) - y ** 2);
const EXTENT = [-3, 3];
const linspace = (count: number) => Array.from({ length: count }, (_, i) => -3 + (6 * i) / (count - 1));

function colorbar(theme: ChartTheme, title: string) {
  return legend(theme, { fill: "color", title, orient: "right", gradientLength: pt(60), gradientThickness: pt(6) });
}

function scales(theme: ChartTheme, domain: number[]): NonNullable<VegaSpec["scales"]> {
  return [
    { name: "x", type: "linear", domain: EXTENT, range: "width" },
    { name: "y", type: "linear", domain: EXTENT, range: "height" },
    { name: "color", type: "linear", domain, range: ramp(theme) },
  ];
}

export function imshow(theme: ChartTheme): VegaSpec {
  const size = 16;
  const step = 6 / size;
  const values = Array.from({ length: size * size }, (_, i) => {
    const x = -3 + (i % size) * step;
    const y = -3 + Math.floor(i / size) * step;
    return { x, y, z: round(surface(x + step / 2, y + step / 2)) };
  });
  return figure({
    data: [{ name: "pixels", values }],
    scales: scales(theme, [-1, 1]),
    axes: frame(theme, "x", "y", "x (nm)", "y (nm)"),
    legends: [colorbar(theme, "Potential (eV)")],
    marks: [{ type: "rect", from: { data: "pixels" }, encode: { enter: {
      x: { scale: "x", field: "x" }, x2: { scale: "x", signal: `datum.x + ${step}` },
      y: { scale: "y", field: "y" }, y2: { scale: "y", signal: `datum.y + ${step}` },
      fill: { scale: "color", field: "z" },
    } } }],
  });
}

/** Non-uniform cell edges, denser near the origin. */
export function pcolormesh(theme: ChartTheme): VegaSpec {
  const edges = [-3, -2, -1.4, -0.9, -0.5, -0.2, 0, 0.2, 0.5, 0.9, 1.4, 2, 3];
  const cells = edges.slice(0, -1).flatMap((x0, i) => edges.slice(0, -1).map((y0, j) => {
    const x1 = edges[i + 1];
    const y1 = edges[j + 1];
    return { x0, x1, y0, y1, z: round(surface((x0 + x1) / 2, (y0 + y1) / 2)) };
  }));
  return figure({
    data: [{ name: "cells", values: cells }],
    scales: scales(theme, [-1, 1]),
    axes: frame(theme, "x", "y", "x (nm)", "y (nm)"),
    legends: [colorbar(theme, "Potential (eV)")],
    marks: [{ type: "rect", from: { data: "cells" }, encode: { enter: {
      x: { scale: "x", field: "x0" }, x2: { scale: "x", field: "x1" },
      y: { scale: "y", field: "y0" }, y2: { scale: "y", field: "y1" },
      fill: { scale: "color", field: "z" }, stroke: { value: theme.foreground }, strokeWidth: { value: AXIS / 2 },
    } } }],
  });
}

const COLUMNS = 61;
const ROWS = 61;
const THRESHOLDS = [-0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8];

/** The raster runs past the axes so the lowest band never outlines the frame; marks clip it. */
const REACH = 3.3;
const centers = (count: number) => Array.from({ length: count }, (_, i) => -REACH + (2 * REACH * (i + 0.5)) / count);

/** Isocontour reads a raster from the top row down, so y runs from REACH to -REACH. */
function raster(): VegaSpec["data"] {
  const xs = centers(COLUMNS);
  const ys = centers(ROWS).reverse();
  const values = ys.flatMap(y => xs.map(x => surface(x, y)));
  const fit = (size: string, count: number) => `${(2 * REACH) / 6} * ${size} / ${count}`;
  const shift = (size: string) => `${(3 - REACH) / 6} * ${size}`;
  return [{
    name: "contours",
    values: [{ width: COLUMNS, height: ROWS, values }],
    transform: [{
      type: "isocontour", thresholds: THRESHOLDS,
      scale: { expr: `[${fit("width", COLUMNS)}, ${fit("height", ROWS)}]` },
      translate: { signal: `[${shift("width")}, ${shift("height")}]` },
    }],
  }];
}

export function contour(theme: ChartTheme): VegaSpec {
  return figure({
    data: raster(),
    scales: scales(theme, [-0.8, 0.8]),
    axes: frame(theme, "x", "y", "x (nm)", "y (nm)"),
    legends: [colorbar(theme, "Potential (eV)")],
    marks: [{ type: "shape", clip: true, from: { data: "contours" }, encode: { enter: {
      stroke: { scale: "color", field: "contour.value" }, strokeWidth: { value: LINE }, fill: { value: "transparent" },
    } }, transform: [{ type: "geoshape", field: "datum.contour" }] }],
  });
}

export function contourf(theme: ChartTheme): VegaSpec {
  return figure({
    data: raster(),
    scales: scales(theme, [-0.8, 0.8]),
    axes: frame(theme, "x", "y", "x (nm)", "y (nm)"),
    legends: [colorbar(theme, "Potential (eV)")],
    marks: [{ type: "shape", clip: true, from: { data: "contours" }, encode: { enter: {
      fill: { scale: "color", field: "contour.value" },
    } }, transform: [{ type: "geoshape", field: "datum.contour" }] }],
  });
}

/** Arrows follow the screen direction of (U, V); the arrowhead is a rotated triangle. */
export function quiver(theme: ChartTheme): VegaSpec {
  const grid = linspace(9);
  const length = 0.5;
  const values = grid.flatMap(x => grid.map(y => {
    const u = -y;
    const v = x;
    const norm = Math.max(Math.hypot(u, v), 1);
    return { x, y, x2: x + (length * u) / norm, y2: y + (length * v) / norm };
  })).filter(arrow => arrow.x !== arrow.x2 || arrow.y !== arrow.y2);
  const tip = { x: { scale: "x", field: "x2" }, y: { scale: "y", field: "y2" } };
  return figure({
    data: [{ name: "arrows", values }],
    scales: [
      { name: "x", type: "linear", domain: [-3.5, 3.5], range: "width" },
      { name: "y", type: "linear", domain: [-3.5, 3.5], range: "height" },
    ],
    axes: frame(theme, "x", "y", "x (mm)", "y (mm)"),
    marks: [
      { type: "rule", from: { data: "arrows" }, encode: { enter: {
        x: { scale: "x", field: "x" }, y: { scale: "y", field: "y" }, x2: tip.x, y2: tip.y,
        stroke: { value: theme.primary }, strokeWidth: { value: LINE },
      } } },
      { type: "symbol", from: { data: "arrows" }, encode: { enter: {
        ...tip, shape: { value: "triangle-up" }, size: { value: pt(3) ** 2 }, fill: { value: theme.primary },
        angle: { signal: "atan2(scale('x', datum.x2) - scale('x', datum.x), scale('y', datum.y) - scale('y', datum.y2)) * 180 / PI" },
      } } },
    ],
  });
}
