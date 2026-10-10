"use client";

import {
  useEffect, useImperativeHandle, useRef, useState,
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
  /** Required human-readable chart name. Supply description or adjacent data for complex charts. */
  label: string;
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
  onError?: (error: Error) => void;
  viewRef?: Ref<VegaViewHandle>;
  loading?: boolean;
  empty?: boolean;
  loadingFallback?: ReactNode;
  emptyFallback?: ReactNode;
  errorFallback?: ReactNode | ((error: Error) => ReactNode);
}

export function createChartConfig(theme: ChartTheme): Config {
  return {
    background: "transparent",
    axis: { labelColor: theme.mutedForeground, titleColor: theme.foreground, domainColor: theme.border,
      tickColor: theme.border, gridColor: theme.border, labelFont: theme.font, titleFont: theme.font, labelFontSize: theme.labelSize, titleFontSize: theme.titleSize },
    legend: { labelColor: theme.foreground, titleColor: theme.foreground, labelFont: theme.font, titleFont: theme.font, labelFontSize: theme.labelSize, titleFontSize: theme.titleSize },
    title: { color: theme.foreground, font: theme.font, fontSize: theme.titleSize, subtitleFontSize: theme.labelSize, subtitleFont: theme.font, subtitleColor: theme.mutedForeground },
  };
}
const asError = (error: unknown) => error instanceof Error ? error : new Error(String(error));

/** One optional Vega runtime. No Vega-Lite compiler or embed dependency. */
export function VegaView({
  spec, label, description, width, height = 240, renderer = "svg", data, signals,
  signalNames = [], onSignalChange, onReady, onError, viewRef, loading = false, empty = false,
  loadingFallback = "Loading chart…", emptyFallback = "No chart data.", errorFallback,
  style, ref, ...props
}: VegaViewProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const view = useRef<View | null>(null);
  const theme = useChartTheme(host);
  const [error, setError] = useState<Error | null>(null);
  const [pending, setPending] = useState(true);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
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
        if (value == null) { setTooltip(null); return; }
        const bounds = host.current!.getBoundingClientRect();
        const pointer = event as MouseEvent;
        setTooltip({ text: typeof value === "object" ? Object.entries(value).map(([key, item]) => `${key}: ${String(item)}`).join(" · ") : String(value),
          x: Math.max(0, Math.min(bounds.width - 20, (pointer.clientX ?? bounds.left) - bounds.left)),
          y: Math.max(0, (pointer.clientY ?? bounds.top) - bounds.top) });
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
  return <div {...props} ref={element => { host.current = element; if (typeof ref === "function") return ref(element); if (ref) ref.current = element; }} role="figure" aria-label={label} aria-busy={busy}
    data-chart-state={state} style={{ position: "relative", minWidth: 0, width: width ?? "100%", fontFamily: "var(--font-sans)", color: "var(--foreground)", ...style }}>
    <div ref={canvasHost} aria-hidden="true" style={{ width: "100%", minHeight: height, overflow: "hidden" }} />
    {description && <p style={{ font: "inherit", margin: 0 }}>{description}</p>}
    {busy && <div role="status">{loadingFallback}</div>}
    {empty && <div role="status">{emptyFallback}</div>}
    {error && <div role="alert">{typeof errorFallback === "function" ? errorFallback(error) : errorFallback ?? "Unable to display chart."}</div>}
    {tooltip && <div role="tooltip" style={{ position: "absolute", left: tooltip.x, top: tooltip.y,
      transform: "translate(-50%, -100%)", pointerEvents: "none", maxWidth: "100%", padding: "calc(var(--spacing, 4px) * 2)",
      borderRadius: "var(--radius-control)", background: "var(--popover)", color: "var(--popover-foreground)",
      border: "1px solid var(--border)", boxShadow: "var(--shadow-overlay)", fontSize: "var(--text-label)" }}>{tooltip.text}</div>}
  </div>;
}
