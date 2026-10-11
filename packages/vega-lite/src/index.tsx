"use client";

import { useEffect, useState } from "react";
import { VegaView, createChartConfig, type VegaViewProps, type VegaSpec, type ChartTheme } from "@molcrafts/ui-vega";
import type { TopLevelSpec, Config } from "vega-lite";
export type { TopLevelSpec as VegaLiteSpec } from "vega-lite";
export type { VegaViewHandle, ChartTheme, ChartData, ChartSignals } from "@molcrafts/ui-vega";

/** Compiler loaded only by consumers invoking this optional adapter. */
export async function compileVegaLite(spec: TopLevelSpec): Promise<VegaSpec> {
  const { compile } = await import("vega-lite");
  return compile(spec).spec;
}
export interface VegaLiteViewProps extends Omit<VegaViewProps, "spec"> {
  spec: TopLevelSpec | ((theme: ChartTheme) => TopLevelSpec);
}

export function VegaLiteView({ spec, onError, loading, errorFallback, ...props }: VegaLiteViewProps) {
  const [compiled, setCompiled] = useState<{ source: VegaLiteViewProps["spec"]; result: VegaViewProps["spec"] } | null>(null);
  useEffect(() => {
    let cancelled = false;
    void import("vega-lite").then(({ compile }) => {
      if (cancelled) return;
      // Compile themed factories inside Viewer so scoped brand changes recompile.
      const result = (theme: ChartTheme) => {
        const source = typeof spec === "function" ? spec(theme) : spec;
        const defaults = createChartConfig(theme) as Config;
        const own = source.config;
        return compile({ ...source, config: { ...defaults, ...own,
          axis: { ...defaults.axis, ...own?.axis },
          legend: { ...defaults.legend, ...own?.legend },
          title: { ...defaults.title, ...own?.title },
        } }).spec;
      };
      setCompiled({ source: spec, result });
    }).catch(failure => {
      if (cancelled) return;
      const next = failure instanceof Error ? failure : new Error(String(failure));
      setCompiled({ source: spec, result: () => { throw next; } });
    });
    return () => { cancelled = true; };
  }, [spec]);
  return <VegaView {...props} spec={compiled?.source === spec ? compiled.result : { marks: [] }}
    loading={loading || compiled?.source !== spec} onError={onError} errorFallback={errorFallback} />;
}
