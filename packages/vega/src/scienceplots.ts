import { molplotPresets } from "./preset.generated";

/** Vega-Lite top-level spec. The object is the authoring language. */
export type VegaLiteSpec = Record<string, unknown>;

export const VL_SCHEMA = "https://vega.github.io/schema/vega-lite/v6.json";

/** Paper design width. Preset type (about 9–12 px) is correct at this width. */
export const DESIGN_WIDTH = 320;

export type PresetName = keyof typeof molplotPresets;

export const DEFAULT_PRESET: PresetName = "molplot";

/**
 * Axis type: Times plus math fonts so τ, Å², and subscripts match paper figures.
 * Matches MolPlot's chart stack. Docs also embed this under the author config.
 */
export const CHART_SERIF_STACK =
  "Times New Roman, Times, STIX Two Text, STIXGeneral, " +
  "Latin Modern Roman, 'Cambria Math', serif";

const FROZEN_TYPE_KEYS = new Set([
  "titleFontSize",
  "labelFontSize",
  "fontSize",
  "titleLimit",
  "labelLimit",
  "titlePadding",
  "labelPadding",
  "tickSize",
  "symbolSize",
  "offset",
  "rowPadding",
  "columnPadding",
]);

type ZoomChannel = "x" | "y";

/** Scale paper tick size toward the host body. Matches MolPlot `fontScaleForHost`. */
export function fontScaleForHost(width: number, bodyPx = 13): number {
  const paperTick = 9;
  const body = Number.isFinite(bodyPx) && bodyPx > 0 ? bodyPx : 13;
  const targetTick = body * 0.95;
  let scale = targetTick / paperTick;
  if (Number.isFinite(width) && width > 0) {
    const widthFactor = Math.min(1.1, Math.max(0.9, width / 560));
    scale *= widthFactor;
  }
  return Math.round(Math.min(1.85, Math.max(1.15, scale)) * 100) / 100;
}

export function parseAspect(value: string | null): number {
  if (!value) return 4 / 3;
  const parts = value.split(/[:/]/).map(Number);
  const ratio = parts.length === 2 && parts[0] && parts[1] ? parts[0] / parts[1] : Number(value);
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 4 / 3;
}

/** Interaction is on unless the attribute is a false-like token. */
export function parseInteractive(value: string | null): boolean {
  if (value === null || value === "") return true;
  return !["false", "0", "off", "none"].includes(value.toLowerCase());
}

export function parseThemeMode(value: string | null): "auto" | "light" | "dark" {
  return value === "light" || value === "dark" ? value : "auto";
}

export function knownPreset(value: string | null): PresetName | null {
  if (value === null || value === "") return DEFAULT_PRESET;
  return value in molplotPresets ? (value as PresetName) : null;
}

/** Docs dark mode is Zensical `slate` or an explicit `.dark` class. */
export function schemeIsDark(input: {
  rootClassDark: boolean;
  rootScheme: string | null;
  bodyScheme: string | null;
  prefersDark: boolean;
}): boolean {
  if (input.rootClassDark) return true;
  const scheme = input.rootScheme ?? input.bodyScheme;
  if (scheme === "slate") return true;
  if (scheme === "default") return false;
  return input.prefersDark;
}

export function readHostStyle(el: HTMLElement | null | undefined): { fontSizePx: number; color: string | null } {
  if (!el || typeof getComputedStyle === "undefined") return { fontSizePx: 13, color: null };
  const host = (el.closest(".md-typeset") as HTMLElement | null) ?? (el.closest("article") as HTMLElement | null) ?? el;
  const style = getComputedStyle(host);
  const fontSizePx = Number.parseFloat(style.fontSize);
  return {
    fontSizePx: Number.isFinite(fontSizePx) && fontSizePx > 0 ? fontSizePx : 13,
    color: style.color?.trim() || null,
  };
}

function stripFrozenTypeSizes(over: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(over)) {
    if (key === "padding") continue;
    if (FROZEN_TYPE_KEYS.has(key) && typeof value === "number") continue;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      out[key] = stripFrozenTypeSizes(value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function deepMerge(base: Record<string, unknown>, over: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(over)) {
    const previous = out[key];
    if (
      value !== null && typeof value === "object" && !Array.isArray(value) &&
      previous !== null && typeof previous === "object" && !Array.isArray(previous)
    ) {
      out[key] = deepMerge(previous as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** Scienceplots Vega-Lite config. Author config is merged later and wins. */
export function scienceplotsConfig(
  presetName: PresetName,
  mode: "light" | "dark",
  fontScale: number,
  ink: string | null,
): Record<string, unknown> {
  const preset = molplotPresets[presetName];
  const colors = mode === "dark" ? preset.modes.dark : preset.modes.light;
  const scale = Number.isFinite(fontScale) && fontScale > 0 ? fontScale : 1;
  const px = (size: number) => Math.round(size * scale * 10) / 10;
  const pad = Math.max(6, Math.round(4 * scale + 3));
  const serif = CHART_SERIF_STACK;
  const inkColor = ink ?? colors.foreground;
  return {
    background: "transparent",
    font: serif,
    padding: { left: pad, right: pad, top: pad, bottom: pad },
    axis: {
      labelColor: inkColor,
      titleColor: inkColor,
      tickColor: colors.tickColor,
      domainColor: colors.tickColor,
      gridColor: colors.gridColorSolid,
      gridWidth: 0.5,
      labelFontSize: px(preset.typography.size.tick),
      titleFontSize: px(preset.typography.size.label),
      labelFont: serif,
      titleFont: serif,
      titleFontStyle: "normal",
      labelFontStyle: "normal",
      titlePadding: Math.round(5 * scale + 2),
      labelPadding: Math.round(3 * scale + 1),
      grid: true,
      tickSize: Math.max(4, Math.round(3 * scale)),
      labelLimit: Math.round(200 * scale),
      titleLimit: Math.round(240 * scale),
      labelOverlap: true,
      labelFlush: true,
    },
    legend: {
      labelColor: inkColor,
      titleColor: inkColor,
      labelFontSize: px(preset.typography.size.legend),
      titleFontSize: px(preset.typography.size.legend),
      labelFont: serif,
      titleFont: serif,
      symbolType: "circle",
      titleLimit: Math.round(160 * scale),
      labelLimit: Math.round(140 * scale),
      padding: Math.round(3 * scale),
      offset: Math.round(4 * scale),
      rowPadding: Math.round(2 * scale),
      columnPadding: Math.round(6 * scale),
      symbolSize: Math.round(40 * scale),
    },
    title: {
      color: inkColor,
      fontSize: px(preset.typography.size.title),
      font: serif,
      fontWeight: 600,
      fontStyle: "normal",
    },
    text: {
      font: serif,
      fontSize: px(preset.typography.size.label),
      color: inkColor,
      fontStyle: "normal",
    },
    view: { stroke: null, continuousWidth: DESIGN_WIDTH, continuousHeight: 200 },
    mark: { color: preset.palette.defaultColor },
    line: { strokeWidth: preset.geometry.lineWidth, color: preset.palette.defaultColor },
    point: { size: preset.geometry.markerSize * preset.geometry.markerSize },
    range: {
      category: [...preset.palette.categorical],
      ramp: { scheme: preset.palette.sequential },
      diverging: { scheme: preset.palette.diverging },
    },
  };
}

function interactionParams(channels: ZoomChannel[]): Record<string, unknown>[] {
  return channels.map((channel) => ({
    name: channel === "x" ? "zoomX" : "zoomY",
    select: {
      type: "interval",
      encodings: [channel],
      // Shift+wheel zooms. Axis-gutter flag stamping stays in MolPlot's editor chart.
      zoom: `view:wheel![event.shiftKey]`,
    },
    bind: "scales",
  }));
}

function mergeZoomParams(existing: unknown, zoom: Record<string, unknown>[]): unknown[] {
  const names = new Set(zoom.map((param) => param.name));
  const kept: unknown[] = [];
  if (Array.isArray(existing)) {
    for (const param of existing) {
      const name = param && typeof param === "object" && "name" in param ? String((param as { name: unknown }).name) : "";
      if (name && names.has(name)) continue;
      kept.push(param);
    }
  }
  return [...kept, ...zoom];
}

function continuousChannels(spec: VegaLiteSpec): ZoomChannel[] {
  const top = spec.encoding as Record<string, { type?: string; field?: string } | undefined> | undefined;
  const layers = Array.isArray(spec.layer)
    ? (spec.layer as { encoding?: Record<string, { type?: string; field?: string }> }[])
    : [];
  const layerEncoding = layers.find((layer) => layer?.encoding)?.encoding;
  return (["x", "y"] as const).filter((channel) => {
    const type = top?.[channel]?.type ?? layerEncoding?.[channel]?.type;
    if (type === "quantitative" || type === "temporal") return true;
    const field = top?.[channel]?.field ?? layerEncoding?.[channel]?.field;
    return Boolean(field && (top?.[channel]?.type || top?.[channel]));
  });
}

export interface PreparedChart {
  spec: VegaLiteSpec;
}

/** Merge the scienceplots preset under the author spec. Author marks, domains, and config win. */
export function prepareChartSpec(author: VegaLiteSpec, options: {
  preset: PresetName;
  mode: "light" | "dark";
  width: number;
  height: number;
  aspectRatio: number;
  interactive: boolean;
  hostFontPx: number;
  ink: string | null;
  title?: string | null;
}): PreparedChart {
  const spec = { ...(author ?? {}) };
  const scale = fontScaleForHost(options.width, options.hostFontPx);
  const derivedHeight = Math.max(1, Math.round(options.width / options.aspectRatio));
  const height = options.height > 1 ? Math.max(1, Math.round(options.height)) : derivedHeight;
  const baseConfig = scienceplotsConfig(options.preset, options.mode, scale, options.ink);
  const authorConfig = spec.config && typeof spec.config === "object"
    ? (spec.config as Record<string, unknown>)
    : null;
  const config = authorConfig ? deepMerge(baseConfig, stripFrozenTypeSizes(authorConfig)) : baseConfig;
  const base: VegaLiteSpec = {
    $schema: VL_SCHEMA,
    width: options.width,
    height,
    autosize: { type: "fit", contains: "padding" },
    ...spec,
    config,
  };
  if (options.title && base.title == null) base.title = options.title;
  const channels = options.interactive ? continuousChannels(spec) : [];
  if (channels.length === 0) return { spec: base };
  const zoom = interactionParams(channels);
  const layers = Array.isArray(spec.layer) ? (spec.layer as Record<string, unknown>[]) : null;
  if (layers && layers.length > 0) {
    const nextLayers = layers.map((layer, index) => {
      if (index !== 0) return layer;
      return { ...layer, params: mergeZoomParams(layer.params, zoom) };
    });
    const { params: _dropped, ...rest } = base;
    return { spec: { ...rest, layer: nextLayers } };
  }
  return { spec: { ...base, params: mergeZoomParams(spec.params, zoom) } };
}

export function readSpec(raw: string | null | undefined): { spec: VegaLiteSpec } | { spec: null; reason: "empty" | "invalid-json" } {
  if (!raw?.trim()) return { spec: null, reason: "empty" };
  try {
    const spec = JSON.parse(raw) as unknown;
    if (!spec || typeof spec !== "object" || Array.isArray(spec)) return { spec: null, reason: "invalid-json" };
    return { spec: spec as VegaLiteSpec };
  } catch {
    return { spec: null, reason: "invalid-json" };
  }
}

/** Inline values arrays that are present and empty. URL-backed data is not empty. */
export function specHasEmptyValues(spec: VegaLiteSpec): boolean {
  const data = spec.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  const values = (data as { values?: unknown }).values;
  return Array.isArray(values) && values.length === 0;
}
