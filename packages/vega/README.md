# @molcrafts/design-vega

Optional native Vega viewer. MIT; private/unpublished. Built with Rslib. Core
`@molcrafts/design` does not depend on this package. Import the Design stylesheet
(or tokens runtime for a plain viewer) in the application.

```tsx
import { VegaView, type VegaViewHandle } from "@molcrafts/design-vega";
import "@molcrafts/design/styles.css";
<VegaView label="Experiment measurements" description="Measurements increase over time."
  spec={vegaSpec} height={240} renderer="svg" />;
```

Accepts official Vega Spec only. No compiler, vega-embed, MolPlot or custom IR.
The runtime is dynamically imported after mounting. SSR imports do not initialize
a View. Default renderer is SVG; canvas is supported. A stable `spec(theme)` factory
can map data marks to inherited semantic colors. `createChartConfig(theme)` supplies Fluent defaults from runtime font/color/size tokens.
User spec config takes precedence
over default axis/legend/title typography. Explicit data palettes stay product-owned.
Theme reads the nearest CSS scope and watches ancestor class/style/data-mol-theme
changes, including root light/dark and runtime product brand changes.

`label` is required. `description` is visible and should summarize important
information; applications must supply a readable table/summary for complex charts.
The renderer DOM is aria-hidden, with the named figure and text as the accessibility
surface. Tooltip strings/objects are rendered as React text, never injected HTML.
Tooltip does not replace the accessible data alternative.

Width defaults to the available container and follows ResizeObserver. Height defaults
to 240 CSS pixels. Explicit width/height select chart view dimensions; specs can
supply their own autosize behavior. Pass stable objects/factories to avoid unnecessary
recreation. New spec/renderer/theme replaces the View; data/signals update it in place.
Removed data/signal keys are not reset implicitly: pass empty data or a reset value.
Loading/empty dispose the current View. Error fallback and onError cover parse/render.
Each render generation owns its DOM and finalizes on replacement/unmount; stale
async work cannot install a View or call ready after cleanup.

Use `signalNames` + `onSignalChange` for selected signal subscriptions. `onReady`
exposes the official View. `viewRef` exposes getView, setSignal, setData, exportSVG and
exportImage (PNG data URL); methods reject before ready. Native div attributes,
className/style/ref are available. No forward-compatibility guarantees for domain APIs.

Remote specs/data follow Vega's loader and expression behavior. Only use trusted
specs; this viewer is not a security sandbox. Browser export of remote images depends
on same-origin/CORS policy. Web Components viewer is not yet implemented; the existing
Design Web Components package must not be described as chart parity.
