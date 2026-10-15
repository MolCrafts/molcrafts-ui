# @molcrafts/ui-vega

Optional native Vega viewer. MIT; published on npm `alpha`. Built with Rslib. Core
`@molcrafts/ui` does not depend on this package. Import the UI stylesheet
(or tokens runtime for a plain viewer) in the application.

```tsx
import { VegaView, type VegaViewHandle } from "@molcrafts/ui-vega";
import "@molcrafts/ui/styles.css";
<VegaView label="Experiment measurements" description="Measurements increase over time."
  spec={vegaSpec} height={240} renderer="svg" />;
```

Three data shapes have a component. The caller picks from the shape; these
components do not know a product's domain.

| Data | Component | Mark |
| --- | --- | --- |
| Parts of one total (`label`, `value`, optional resolved `color`) | `ArcChart` | arc |
| One magnitude per category | `BarChart` | bar, `orientation` `vertical` or `horizontal` |
| An ordered series (`x`, `y`; numeric `x` is linear) | `Plot` | line |

```tsx
import { ArcChart, BarChart, Plot } from "@molcrafts/ui-vega";
```

`color` must already be a paint Vega can use. A CSS variable is not resolved here.
`label` stays the accessible name; pass `labelHidden` when the page titles the figure.

Accepts official Vega Spec only. No compiler, vega-embed, MolPlot or custom IR.
The runtime is dynamically imported after mounting. SSR imports do not initialize
a View. Default renderer is SVG; canvas is supported. A stable `spec(theme)` factory
can map data marks to inherited semantic colors. `createChartConfig(theme)` supplies Fluent defaults from runtime font/color/size tokens.
User spec config takes precedence
over default axis/legend/title typography. Explicit data palettes stay product-owned.
Theme reads the nearest CSS scope and watches ancestor class/style/data-mol-theme
changes, including root light/dark and runtime product brand changes.

`label` is required and visible. It is the figure title and its accessible name.
Set `labelHidden` when the page already titles the figure: the label stays the
accessible name and is not drawn.
`description` is visible once the chart is ready, and hidden while loading, empty,
or failed. It is linked with `aria-describedby`. Applications must supply a readable
table or summary for complex charts. The figure is in tab order. The renderer DOM
is aria-hidden. Tooltip strings and objects are rendered as React text, never
injected HTML. A tooltip does not replace the accessible data alternative.

Width defaults to the available container and follows ResizeObserver. Height defaults
to 240 CSS pixels. Explicit width/height select chart view dimensions; specs can
supply their own autosize behavior. Pass stable objects/factories to avoid unnecessary
recreation. New spec/renderer/theme replaces the View; data/signals update it in place.
Removed data/signal keys are not reset implicitly: pass empty data or a reset value.
Loading and empty dispose the current View and replace the plot with their own status.
The default error alert shows the caught message and tells the reader to check the spec.
`onError` receives that same Error. Pass `errorFallback` to replace the alert.
Each render generation owns its DOM and finalizes on replacement/unmount; stale
async work cannot install a View or call ready after cleanup.

Use `signalNames` + `onSignalChange` for selected signal subscriptions. `onReady`
exposes the official View. `viewRef` exposes getView, setSignal, setData, exportSVG and
exportImage (PNG data URL); methods reject before ready. Native div attributes,
className/style/ref are available. No forward-compatibility guarantees for domain APIs.

Remote specs/data follow Vega's loader and expression behavior. Only use trusted
specs; this viewer is not a security sandbox. Browser export of remote images depends
on same-origin/CORS policy. `<molcrafts-chart>` is registered by `@molcrafts/ui-vega-lite`,
not by `@molcrafts/ui-web-components`. The React viewers stay on the Fluent product theme
unless a caller opts into the scienceplots preset.
