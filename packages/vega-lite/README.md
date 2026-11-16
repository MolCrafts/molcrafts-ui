# @molcrafts/ui-vega-lite

Optional Vega-Lite compiler adapter. MIT; published on npm `alpha`. Depends on the single
`@molcrafts/ui-vega` Viewer and Vega-Lite, not a second renderer or vega-embed.
The compiler is loaded asynchronously; native Vega consumers never import this package.

```tsx
import { VegaLiteView } from "@molcrafts/ui-vega-lite";
<VegaLiteView label="Measurements" description="Three observed values."
  spec={{ data: { values: [{ x: 1, y: 2 }] }, mark: "point",
    encoding: { x: { field: "x", type: "quantitative" }, y: { field: "y", type: "quantitative" } } }} />;
```

Accepts official TopLevelSpec or stable theme-to-spec factory. `compileVegaLite(spec)`
returns the official Vega spec asynchronously. Viewer props, refs, signals, named data,
export and fallback behavior reuse design-vega. For a themed factory compilation runs
again when the inherited theme changes; no additional IR or scientific editor model.
Signal/data names are those of the compiled Vega spec; use named source datasets if
updating data externally, and inspect compiled signals before subscribing.

Import either adapter at a route/component lazy boundary in Rsbuild/Rspack. Merely
splitting npm packages does not ensure smaller entry bundles: verify the native Vega
route and core UI entry exclude the compiler. Figure editing, selection semantics,
Artist Tree, property inspectors and Undo/Redo belong to MolPlot. CI record mappings
belong to CI; Molab can use this package without importing MolPlot.

`<molcrafts-chart>` is the non-React element for static pages. Load `browser.js`
(one self-contained module). It reads a Vega-Lite JSON script, and `preset="molplot"`
applies the scienceplots snapshot from `@molcrafts/ui-vega/preset`. `VegaLiteView`
without that preset keeps the Fluent product theme. The element is not registered
from `@molcrafts/ui` or `@molcrafts/ui-web-components`.

```html
<script type="module" src="./browser.js"></script>
<molcrafts-chart preset="molplot" theme="auto" aspect="16:10" label="Chart" label-hidden>
  <script type="application/json">{ "mark": "line", "data": { "values": [] },
    "encoding": { "x": {"field":"x","type":"quantitative"},
                  "y": {"field":"y","type":"quantitative"} } }</script>
</molcrafts-chart>
```
