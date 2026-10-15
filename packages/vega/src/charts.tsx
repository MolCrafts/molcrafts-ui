"use client";

import { useMemo } from "react";
import { VegaView, type ChartTheme, type VegaSpec } from "./index";

/** One part of a whole. `color` is a resolved paint, never a CSS variable. */
export interface ArcDatum {
  label: string;
  value: number;
  color?: string;
  /** Hover text. Defaults to the label and value. */
  tip?: string;
}

/** One category and its magnitude. */
export interface BarDatum {
  label: string;
  value: number;
  color?: string;
  /** Hover text. Defaults to the label and value. */
  tip?: string;
}

/** One point on an ordered series. Numeric `x` is linear. */
export interface PlotPoint {
  x: string | number;
  y: number;
  /** Hover text. Defaults to the coordinates. */
  tip?: string;
}

interface ChartFrame {
  /** Accessible name. Hidden when the page already titles the figure. */
  label: string;
  labelHidden?: boolean;
  description?: string;
  height?: number;
  width?: number;
  className?: string;
  loading?: boolean;
}

const asRows = (rows: readonly object[]): Record<string, unknown>[] =>
  rows.map((row) => ({ ...row }));

const distinct = (labels: readonly string[]): string[] => {
  const seen = new Map<string, number>();
  return labels.map((label) => {
    const count = seen.get(label) ?? 0;
    seen.set(label, count + 1);
    return count === 0 ? label : `${label}${"\u200b".repeat(count)}`;
  });
};

const plain = (field: string): string => `replace(datum.${field} + '', /[\\u200b]/g, '')`;

/** An explicit tip wins. Otherwise name the mark, and skip a blank axis label. */
const tipSignal = (fallback: string): { signal: string } => ({
  signal: `datum.tip != null && datum.tip !== '' ? datum.tip : (${fallback})`,
});

const labelValue = (label: string, value: string): string =>
  `(${label}) == '' ? format(${value}, ',') : (${label}) + ': ' + format(${value}, ',')`;

const hoverSignal = (mark: string, field: string) => ({
  name: "hovered",
  value: null,
  on: [
    { events: `${mark}:pointerover`, update: `datum.${field}` },
    { events: `${mark}:pointerout`, update: "null" },
  ],
});

/** Full ink at rest. The mark under the pointer stays full; the others recede. */
const emphasis = (match: string): { signal: string } => ({
  signal: `hovered == null || hovered === ${match} ? 1 : 0.4`,
});

/** Start at the top and walk clockwise. Zero shares take no angle. */
export const arcSlices = (
  data: readonly ArcDatum[],
): Array<ArcDatum & { startAngle: number; endAngle: number }> => {
  const total = data.reduce((sum, item) => sum + Math.max(0, item.value), 0);
  let angle = -Math.PI / 2;
  return data.map((item) => {
    const sweep = total > 0 ? (Math.max(0, item.value) / total) * Math.PI * 2 : 0;
    const slice = { ...item, startAngle: angle, endAngle: angle + sweep };
    angle += sweep;
    return slice;
  });
};

/** Part-to-whole. The ring is a Vega arc mark; the legend names each share. */
export const arcSpec = (theme: ChartTheme, shares: readonly ArcDatum[]): VegaSpec => {
  const labels = shares.map((item) => item.label);
  const colors = shares.map((item) => item.color || theme.primary);
  return {
    autosize: { type: "fit", contains: "padding" },
    background: "transparent",
    padding: 4,
    data: [{ name: "shares" }],
    scales: [{ name: "color", type: "ordinal", domain: labels, range: colors }],
    signals: [
      { name: "radius", update: "min(width, height) / 2 - 4" },
      hoverSignal("arc", "label"),
    ],
    legends: [{
      fill: "color",
      orient: "right",
      labelColor: theme.foreground,
      labelFont: theme.font,
      labelFontSize: theme.labelSize,
      symbolType: "circle",
    }],
    marks: [{
      type: "arc",
      from: { data: "shares" },
      encode: {
        enter: {
          x: { signal: "width / 2" },
          y: { signal: "height / 2" },
          innerRadius: { signal: "radius * 0.62" },
          outerRadius: { signal: "radius" },
          startAngle: { field: "startAngle" },
          endAngle: { field: "endAngle" },
          fill: { scale: "color", field: "label" },
          stroke: { value: theme.background },
          strokeWidth: { value: 1 },
        },
        update: {
          fillOpacity: emphasis("datum.label"),
          tooltip: tipSignal(labelValue(plain("label"), "datum.value")),
        },
        hover: { cursor: { value: "pointer" } },
      },
    }],
  } as VegaSpec;
};

/** Categories compared by magnitude. `horizontal` reads a short list of names. */
export const barSpec = (theme: ChartTheme, orientation: "vertical" | "horizontal"): VegaSpec => {
  const horizontal = orientation === "horizontal";
  return {
    autosize: { type: "fit", contains: "padding" },
    background: "transparent",
    padding: { left: 4, right: 8, top: 4, bottom: 4 },
    data: [{ name: "bars" }],
    signals: [hoverSignal("rect", "label")],
    scales: [
      {
        name: "band",
        type: "band",
        domain: { data: "bars", field: "label" },
        range: horizontal ? "height" : "width",
        paddingInner: 0.28,
        paddingOuter: 0.12,
      },
      {
        name: "measure",
        type: "linear",
        domain: { data: "bars", field: "value" },
        range: horizontal ? "width" : "height",
        zero: true,
        nice: true,
      },
    ],
    axes: [
      {
        orient: horizontal ? "left" : "bottom",
        scale: "band",
        domain: false,
        ticks: false,
        labelColor: theme.mutedForeground,
        labelFont: theme.font,
        labelFontSize: theme.labelSize,
        labelLimit: 140,
        labelPadding: 6,
        labelOverlap: false,
      },
      {
        orient: horizontal ? "bottom" : "left",
        scale: "measure",
        domain: false,
        ticks: false,
        tickCount: 3,
        format: "d",
        grid: true,
        gridColor: theme.border,
        labelColor: theme.mutedForeground,
        labelFont: theme.font,
        labelFontSize: theme.labelSize,
        labelPadding: 6,
      },
    ],
    marks: [{
      type: "rect",
      from: { data: "bars" },
      encode: {
        update: {
          x: horizontal ? { scale: "measure", value: 0 } : { scale: "band", field: "label" },
          x2: horizontal ? { scale: "measure", field: "value" } : { scale: "band", field: "label", offset: { scale: "band", band: 1 } },
          y: horizontal ? { scale: "band", field: "label" } : { scale: "measure", field: "value" },
          y2: horizontal ? { scale: "band", field: "label", offset: { scale: "band", band: 1 } } : { scale: "measure", value: 0 },
          fill: [
            { test: "datum.color != null && datum.color !== ''", field: "color" },
            { value: theme.primary },
          ],
          fillOpacity: emphasis("datum.label"),
          stroke: [
            { test: "hovered != null && hovered === datum.label", value: theme.foreground },
            { value: "transparent" },
          ],
          strokeWidth: { signal: "hovered != null && hovered === datum.label ? 1.5 : 0" },
          tooltip: tipSignal(labelValue(plain("label"), "datum.value")),
        },
        hover: { cursor: { value: "pointer" } },
      },
    }],
  } as VegaSpec;
};

/** An ordered series. A numeric x is linear; anything else stays in data order. */
export const plotSpec = (theme: ChartTheme, numericX: boolean): VegaSpec => ({
  autosize: { type: "fit", contains: "padding" },
  background: "transparent",
  padding: { left: 4, right: 8, top: 8, bottom: 4 },
  data: [{ name: "points" }],
  signals: [hoverSignal("rect", "x")],
  scales: [
    numericX
      ? { name: "x", type: "linear", domain: { data: "points", field: "x" }, range: "width", zero: false, nice: true }
      : { name: "x", type: "point", domain: { data: "points", field: "x" }, range: "width", padding: 0.4 },
    { name: "y", type: "linear", domain: { data: "points", field: "y" }, range: "height", zero: true, nice: true },
  ],
  axes: [
    {
      orient: "bottom",
      scale: "x",
      domainColor: theme.border,
      tickColor: theme.border,
      labelColor: theme.mutedForeground,
      labelFont: theme.font,
      labelFontSize: theme.labelSize,
      labelOverlap: true,
      labelLimit: 72,
      labelPadding: 6,
    },
    {
      orient: "left",
      scale: "y",
      domain: false,
      ticks: false,
      tickCount: 3,
      format: "d",
      grid: true,
      gridColor: theme.border,
      labelColor: theme.mutedForeground,
      labelFont: theme.font,
      labelFontSize: theme.labelSize,
    },
  ],
  marks: [
    {
      type: "line",
      from: { data: "points" },
      encode: {
        update: {
          x: { scale: "x", field: "x" },
          y: { scale: "y", field: "y" },
          stroke: { value: theme.primary },
          strokeWidth: { value: 1.5 },
        },
      },
    },
    {
      type: "symbol",
      from: { data: "points" },
      encode: {
        update: {
          x: { scale: "x", field: "x" },
          y: { scale: "y", field: "y" },
          size: { signal: "hovered != null && hovered === datum.x ? 160 : 49" },
          fill: { value: theme.primary },
          fillOpacity: emphasis("datum.x"),
        },
      },
    },
    {
      type: "rect",
      from: { data: "points" },
      encode: {
        update: {
          x: { scale: "x", field: "x", offset: { signal: "-max(18, width / (data('points').length || 1)) / 2" } },
          width: { signal: "max(18, width / (data('points').length || 1))" },
          y: { value: 0 },
          y2: { signal: "height" },
          fill: { value: theme.foreground },
          fillOpacity: { value: 0.001 },
          tooltip: tipSignal(
            `isNumber(datum.x) ? format(datum.x, ',') + ', ' + format(datum.y, ',') : ${labelValue(plain("x"), "datum.y")}`,
          ),
        },
        hover: { cursor: { value: "pointer" } },
      },
    },
  ],
} as VegaSpec);

/** Shares of one total. Use this for a composition, not for a time series. */
export const ArcChart = ({
  data,
  label,
  labelHidden,
  description,
  height,
  width,
  className,
  loading = false,
}: ChartFrame & { data: readonly ArcDatum[] }) => {
  const signature = data.map((item) => `${item.label}\t${item.color ?? ""}`).join("\n");
  const spec = useMemo(() => (theme: ChartTheme) => arcSpec(theme, data), [signature]);
  const slices = useMemo(() => arcSlices(data).filter((item) => item.value > 0), [data]);
  return (
    <VegaView
      spec={spec}
      data={{ shares: asRows(slices) }}
      label={label}
      labelHidden={labelHidden}
      description={description}
      height={height}
      width={width}
      className={className}
      loading={loading}
      empty={!loading && slices.length === 0}
      renderer="svg"
    />
  );
};

/** One bar per category. Use this for counts, mixes, and binned magnitudes. */
export const BarChart = ({
  data,
  orientation = "vertical",
  label,
  labelHidden,
  description,
  height,
  width,
  className,
  loading = false,
}: ChartFrame & { data: readonly BarDatum[]; orientation?: "vertical" | "horizontal" }) => {
  const signature = `${orientation}\n${data.map((item) => `${item.label}\t${item.value}\t${item.color ?? ""}\t${item.tip ?? ""}`).join("\n")}`;
  const spec = useMemo(() => (theme: ChartTheme) => barSpec(theme, orientation), [orientation]);
  const rows = useMemo(() => {
    const labels = distinct(data.map((item) => item.label));
    return data.map((item, index) => ({
      label: labels[index] ?? item.label,
      value: item.value,
      color: item.color,
      tip: item.tip,
    }));
  }, [signature]);
  return (
    <VegaView
      spec={spec}
      data={{ bars: asRows(rows) }}
      label={label}
      labelHidden={labelHidden}
      description={description}
      height={height}
      width={width}
      className={className}
      loading={loading}
      empty={!loading && data.length === 0}
      renderer="svg"
    />
  );
};

/** A line through ordered points. Use this for a series, not for unrelated categories. */
export const Plot = ({
  points,
  label,
  labelHidden,
  description,
  height,
  width,
  className,
  loading = false,
}: ChartFrame & { points: readonly PlotPoint[] }) => {
  const numericX = points.length > 0 && points.every((point) => typeof point.x === "number");
  const signature = `${numericX}\n${points.map((point) => `${point.x}\t${point.y}\t${point.tip ?? ""}`).join("\n")}`;
  const spec = useMemo(() => (theme: ChartTheme) => plotSpec(theme, numericX), [numericX]);
  const rows = useMemo(() => {
    if (numericX) return points.map((point) => ({ x: point.x, y: point.y, tip: point.tip }));
    const labels = distinct(points.map((point) => String(point.x)));
    return points.map((point, index) => ({
      x: labels[index] ?? String(point.x),
      y: point.y,
      tip: point.tip,
    }));
  }, [signature]);
  return (
    <VegaView
      spec={spec}
      data={{ points: asRows(rows) }}
      label={label}
      labelHidden={labelHidden}
      description={description}
      height={height}
      width={width}
      className={className}
      loading={loading}
      empty={!loading && points.length === 0}
      renderer="svg"
    />
  );
};
