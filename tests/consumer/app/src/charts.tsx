import { StrictMode, useRef, useState } from "react";
import { VegaView, type VegaSpec, type VegaViewHandle } from "@molcrafts/ui-vega";
import { VegaLiteView, type VegaLiteSpec } from "@molcrafts/ui-vega-lite";
import { Button, ScrollArea, Table, TableBody, TableRow, TableCell, ThemeScope } from "@molcrafts/ui";

const raw: VegaSpec = {
  padding: 0, autosize: { type: "fit", contains: "padding" },
  signals: [{ name: "offset", value: 0 }], data: [{ name: "points", values: [{ x: 1, y: 2 }, { x: 2, y: 4 }] }],
  scales: [{ name: "x", type: "linear", domain: [0, 3], range: "width" }, { name: "y", type: "linear", domain: [0, 10], range: "height" }],
  marks: [{ type: "symbol", from: { data: "points" }, encode: { update: {
    x: { scale: "x", field: "x" }, y: { scale: "y", signal: "datum.y + offset" }, size: { value: 90 }, fill: { value: "steelblue" },
  } } }],
};
const lite: VegaLiteSpec = {
  autosize: { type: "fit", contains: "padding" }, data: { values: [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 1 }] },
  mark: { type: "line", point: true, tooltip: true },
  encoding: { x: { field: "x", type: "quantitative" }, y: { field: "y", type: "quantitative" } },
};
const themed = (theme: import("@molcrafts/ui-vega").ChartTheme): VegaLiteSpec => ({ ...lite, mark: { type: "line", color: theme.primary, point: true, tooltip: true } });

function Charts() {
  const handle = useRef<VegaViewHandle>(null);
  const [signal, setSignal] = useState(0);
  const [signals, setSignals] = useState({ offset: 0 });
  const [data, setData] = useState({ points: [{ x: 1, y: 2 }, { x: 2, y: 4 }] });
  const [mounted, setMounted] = useState(true);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [width, setWidth] = useState(460);
  const [broken, setBroken] = useState(false);
  const [svg, setSvg] = useState("");
  const [ready, setReady] = useState(0);
  return <main>
    <h1>Optional chart consumers</h1>
    <Button onClick={() => setMode(mode === "light" ? "dark" : "light")}>Chart theme</Button>
    <Button onClick={() => setWidth(width === 460 ? 280 : 460)}>Resize chart</Button>
    <Button onClick={() => setSignals({ offset: 2 })}>Update signal</Button>
    <Button onClick={() => setData({ points: [{ x: 1, y: 8 }] })}>Update chart data</Button>
    <Button onClick={() => setBroken(!broken)}>Invalid spec</Button>
    <Button onClick={() => setMounted(!mounted)}>Mount chart</Button>
    <Button onClick={async () => setSvg(await handle.current!.exportSVG())}>Export SVG</Button>
    <output aria-label="Signal value">{signal}</output><output aria-label="Ready count">{ready}</output>
    <output aria-label="Exported SVG">{svg.slice(0, 100)}</output>
    <ThemeScope theme={mode} style={{ width }} data-testid="chart-scope">
      {mounted && <VegaView label="Native Vega measurements" description="Two measurements, updated by controls."
        spec={broken ? { signals: [{ name: "bad", update: "missingFunction()" }] } : raw}
        height={150} viewRef={handle} data={data} signals={signals} signalNames={["offset"]}
        onSignalChange={(_, value) => setSignal(Number(value))} onReady={() => setReady(n => n + 1)} />}
      <VegaLiteView label="Vega-Lite measurements" description="Values 2, 4 and 1." spec={themed} height={160} />
      <VegaView label="Canvas measurements" spec={raw} height={100} renderer="canvas" />
      <VegaView label="Loading measurements" spec={raw} loading height={20} />
      <VegaView label="Empty measurements" spec={raw} empty height={20} />
      <VegaLiteView label="Invalid Lite measurements" spec={{ mark: "invalid-mark" } as unknown as VegaLiteSpec} height={20} />
    </ThemeScope>
    <ScrollArea data-testid="table-scroll" style={{ width: 280, height: 120 }}>
      <Table><TableBody><TableRow><TableCell>{"long coverage path/".repeat(100)}</TableCell></TableRow></TableBody></Table>
    </ScrollArea>
  </main>;
}
export default function ChartConsumer() { return <StrictMode><Charts /></StrictMode>; }
