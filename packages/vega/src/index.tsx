"use client";

import {
  useEffect, useId, useImperativeHandle, useRef, useState,
  type ComponentProps, type ReactNode, type Ref,
} from "react";
import type { Config, Spec, View, ScenegraphEvent } from "vega";
import { useChartTheme, type ChartTheme } from "./theme";

export { useChartTheme } from "./theme";
export type { ChartTheme } from "./theme";
export type { Spec as VegaSpec } from "vega";
export type ChartData = Record<string, readonly Record<string, unknown>[]>;
export type ChartSignals = Record<string, unknown>;
export type ChartRenderer = "svg" | "canvas";

export interface VegaViewHandle {
  /** Null while loading, on errors and after disposal. */
  getView(): View | null;
  setSignal(name: string, value: unknown): Promise<void>;
  setData(name: string, values: readonly Record<string, unknown>[]): Promise<void>;
  exportSVG(): Promise<string>;
  exportImage(scale?: number): Promise<string>;
}

export interface VegaViewProps extends Omit<ComponentProps<"div">, "children" | "onError"> {
  /** Native Vega spec only; a stable factory can use inherited theme colors. */
  spec: Spec | ((theme: ChartTheme) => Spec);
  /** Required chart name. Rendered as the figure’s visible title and accessible name. */
  label: string;
  /** Keeps `label` as the accessible name without drawing it. Use when the page already titles the figure. */
  labelHidden?: boolean;
  /** Visible summary once the chart is ready. Hidden while loading, empty, or failed. Supply a table for complex data. */
  description?: string;
  width?: number;
  height?: number;
  renderer?: ChartRenderer;
  data?: ChartData;
  signals?: ChartSignals;
  /** Subscribe only to these named signals; initial/update values are also reported. */
  signalNames?: readonly string[];
  onSignalChange?: (name: string, value: unknown) => void;
  onReady?: (view: View) => void;
  /** Called with the same Error shown in the alert. */
  onError?: (error: Error) => void;
  viewRef?: Ref<VegaViewHandle>;
  loading?: boolean;
  empty?: boolean;
  /** Replaces the plot while loading. Default: “Loading chart…”. */
  loadingFallback?: ReactNode;
  /** Replaces the plot when empty. Default: “No chart data.” */
  emptyFallback?: ReactNode;
  /** Replaces the plot on failure. Default: the error message and a prompt to check the spec. */
  errorFallback?: ReactNode | ((error: Error) => ReactNode);
}

export function createChartConfig(theme: ChartTheme): Config {
  return {
    background: "transparent",
    axis: { labelColor: theme.mutedForeground, titleColor: theme.foreground, domainColor: theme.border,
      tickColor: theme.border, gridColor: theme.border, labelFont: theme.font, titleFont: theme.font,
      labelFontSize: theme.labelSize, titleFontSize: theme.labelSize, labelFontWeight: 400, titleFontWeight: 400 },
    legend: { labelColor: theme.foreground, titleColor: theme.foreground, labelFont: theme.font, titleFont: theme.font, labelFontSize: theme.labelSize, titleFontSize: theme.titleSize },
    title: { color: theme.foreground, font: theme.font, fontSize: theme.titleSize, subtitleFontSize: theme.labelSize, subtitleFont: theme.font, subtitleColor: theme.mutedForeground },
  };
}
const visuallyHidden = {
  position: "absolute", width: 1, height: 1, margin: -1, padding: 0, overflow: "hidden",
  clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
} as const;
const asError = (error: unknown) => error instanceof Error ? error : new Error(String(error));

/** Vega-Lite wraps one anonymous field as `{ tooltip: "…" }`. Show the sentence, not the field name. */
const tooltipText = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((item) => tooltipText(item)).filter(Boolean).join("\n");
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, item]) => item != null && item !== "");
    if (entries.length === 1 && entries[0]?.[0].toLowerCase() === "tooltip") return tooltipText(entries[0][1]);
    return entries.map(([key, item]) => `${key}: ${tooltipText(item)}`).join("\n");
  }
  return String(value);
};

/** One optional Vega runtime. No Vega-Lite compiler or embed dependency. */
export function VegaView({
  spec, label, labelHidden = false, description, width, height = 240, renderer = "svg", data, signals,
  signalNames = [], onSignalChange, onReady, onError, viewRef, loading = false, empty = false,
  loadingFallback = "Loading chart…", emptyFallback = "No chart data.", errorFallback,
  style, ref, className, tabIndex, onFocus, onBlur,
  "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy,
  ...props
}: VegaViewProps) {
  const titleId = useId();
  const descriptionId = useId();
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const view = useRef<View | null>(null);
  const theme = useChartTheme(host);
  const [error, setError] = useState<Error | null>(null);
  const [pending, setPending] = useState(true);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; below: boolean } | null>(null);
  const callbacks = useRef({ onReady, onError, onSignalChange });
  callbacks.current = { onReady, onError, onSignalChange };
  const latest = useRef({ data, signals });
  latest.current = { data, signals };
  const signalKey = JSON.stringify(signalNames);
  const report = (failure: unknown) => {
    const next = asError(failure); setError(next); setPending(false); callbacks.current.onError?.(next);
  };
  useImperativeHandle(viewRef, () => ({
    getView: () => view.current,
    async setSignal(name, value) {
      if (!view.current) throw new Error("Chart is not ready");
      await view.current.signal(name, value).runAsync();
    },
    async setData(name, values) {
      if (!view.current) throw new Error("Chart is not ready");
      await view.current.data(name, [...values]).runAsync();
    },
    async exportSVG() {
      if (!view.current) throw new Error("Chart is not ready");
      return view.current.toSVG();
    },
    async exportImage(scale = 1) {
      if (!view.current) throw new Error("Chart is not ready");
      return view.current.toImageURL("png", scale);
    },
  }), []);

  useEffect(() => {
    const container = canvasHost.current;
    if (!container || !theme || loading || empty) { setPending(false); return; }
    let cancelled = false;
    let active: View | null = null;
    let resize: ResizeObserver | undefined;
    setPending(true); setError(null); setTooltip(null);
    // Each generation owns its DOM: a late run must never touch the next chart.
    const generation = document.createElement("div");
    container.append(generation);
    const alive = () => !cancelled && active === view.current;
    const updateInputs = async () => {
      if (!active || !alive()) return;
      for (const [name, values] of Object.entries(latest.current.data ?? {})) active.data(name, [...values]);
      for (const [name, value] of Object.entries(latest.current.signals ?? {})) active.signal(name, value);
      await active.runAsync();
    };
    void (async () => {
      const vega = await import("vega");
      if (cancelled) return;
      const resolved = typeof spec === "function" ? spec(theme) : spec;
      active = new vega.View(vega.parse(resolved, createChartConfig(theme)), { renderer, container: generation, hover: true });
      view.current = active;
      active.tooltip((_view: View, event: ScenegraphEvent, _item: unknown, value: unknown) => {
        if (!alive()) return;
        const text = tooltipText(value);
        if (!text) { setTooltip(null); return; }
        const bounds = (frame.current ?? host.current!).getBoundingClientRect();
        const pointer = event as MouseEvent;
        const y = Math.max(0, (pointer.clientY ?? bounds.top) - bounds.top);
        setTooltip({
          text,
          x: Math.max(8, Math.min(bounds.width - 8, (pointer.clientX ?? bounds.left) - bounds.left)),
          y,
          below: y < 28,
        });
      });
      for (const name of JSON.parse(signalKey) as string[]) active.addSignalListener(name, (name, value) => {
        if (alive()) callbacks.current.onSignalChange?.(name, value);
      });
      const size = () => {
        if (!active || !alive()) return;
        active.width(width ?? Math.max(1, container.clientWidth)).height(height);
        void active.resize().runAsync().catch(failure => { if (alive()) report(failure); });
      };
      active.width(width ?? Math.max(1, container.clientWidth)).height(height);
      await updateInputs();
      if (!alive()) return;
      if (width === undefined) { resize = new ResizeObserver(size); resize.observe(container); }
      setPending(false); callbacks.current.onReady?.(active);
    })().catch(failure => { if (!cancelled) { active?.finalize(); if (view.current === active) view.current = null; report(failure); } });
    return () => {
      cancelled = true; resize?.disconnect(); active?.finalize();
      if (view.current === active) view.current = null;
      generation.remove();
    };
  }, [spec, theme, renderer, width, height, loading, empty, signalKey]);

  useEffect(() => {
    const active = view.current;
    if (!active) return;
    let cancelled = false;
    try {
      for (const [name, values] of Object.entries(data ?? {})) active.data(name, [...values]);
      for (const [name, value] of Object.entries(signals ?? {})) active.signal(name, value);
      void active.runAsync().catch(failure => { if (!cancelled && active === view.current) report(failure); });
    } catch (failure) { report(failure); }
    return () => { cancelled = true; };
  }, [data, signals]);

  const busy = loading || pending;
  const state = error ? "error" : empty ? "empty" : busy ? "loading" : "ready";
  const describedBy = [state === "ready" && description ? descriptionId : null, ariaDescribedBy].filter(Boolean).join(" ") || undefined;
  const gap = "calc(var(--spacing, 0.25rem) * 2)";
  const errorBody = error
    ? typeof errorFallback === "function"
      ? errorFallback(error)
      : errorFallback ?? <>
        <p style={{ margin: 0, fontWeight: "var(--font-weight-semibold)" }}>{error.message}</p>
        <p style={{ margin: `${gap} 0 0` }}>Check the spec and try again.</p>
      </>
    : null;
  return <div {...props} ref={element => { host.current = element; if (typeof ref === "function") return ref(element); if (ref) ref.current = element; }}
    role="figure" aria-labelledby={ariaLabelledBy ?? titleId} aria-describedby={describedBy} aria-busy={busy} tabIndex={tabIndex ?? 0}
    data-chart-state={state} className={["mol-focus", className].filter(Boolean).join(" ")}
    onFocus={onFocus} onBlur={onBlur}
    style={{ position: "relative", minWidth: 0, width: width === undefined ? "100%" : `calc(${width}px + ${gap} * 2)`, boxSizing: "border-box",
      padding: gap, fontFamily: "var(--font-sans)", fontSize: "var(--text-body)", lineHeight: "var(--text-body--line-height)",
      fontVariantNumeric: "tabular-nums", color: "var(--foreground)", ...style }}>
    <p id={titleId} style={labelHidden ? visuallyHidden : { margin: 0, fontSize: "var(--text-body)", lineHeight: "var(--text-body--line-height)", fontWeight: "var(--font-weight-semibold)" }}>{label}</p>
    <div ref={frame} style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: height, marginTop: labelHidden ? 0 : gap }}>
      <div ref={canvasHost} aria-hidden="true" style={{ width: "100%", flex: state === "ready" ? "1 0 auto" : "0 0 0px", minHeight: state === "ready" ? height : 0, overflow: "hidden" }} />
      {state === "loading" && <div role="status" style={{ marginBlock: "auto", paddingBlock: gap }}>
        <div aria-hidden="true" style={{ display: "grid", gap, marginBottom: gap }}>
          {["72%", "44%", "60%"].map(bar => <span key={bar} style={{ display: "block", height: "0.5rem", width: bar, borderRadius: "var(--radius-control)", background: "color-mix(in srgb, var(--foreground) 16%, var(--background))" }} />)}
        </div>
        {loadingFallback}
      </div>}
      {state === "empty" && <div role="status" style={{ marginBlock: "auto", paddingBlock: gap }}>{emptyFallback}</div>}
      {state === "error" && errorBody && <div role="alert" style={{ marginBlock: "auto", padding: gap, borderRadius: "var(--radius-control)", border: "1px solid var(--status-failed)", background: "var(--status-failed-soft)", color: "var(--status-failed-foreground)" }}>{errorBody}</div>}
      {tooltip && <div role="tooltip" style={{ position: "absolute", left: tooltip.x, top: tooltip.y, zIndex: 2,
        transform: tooltip.below ? "translate(-50%, 12px)" : "translate(-50%, calc(-100% - 8px))", pointerEvents: "none", maxWidth: "100%", padding: gap,
        borderRadius: "var(--radius-control)", background: "var(--popover)", color: "var(--popover-foreground)",
        border: "1px solid var(--border)", boxShadow: "var(--shadow-overlay)", fontSize: "var(--text-label)", lineHeight: "var(--text-label--line-height)", whiteSpace: "pre-line" }}>{tooltip.text}</div>}
    </div>
    {state === "ready" && description && <p id={descriptionId} style={{ margin: `${gap} 0 0`, fontSize: "var(--text-body)", lineHeight: "var(--text-body--line-height)" }}>{description}</p>}
  </div>;
}

export { ArcChart, BarChart, Plot, arcSlices, arcSpec, barSpec, plotSpec } from "./charts";
export type { ArcDatum, BarDatum, PlotPoint } from "./charts";
