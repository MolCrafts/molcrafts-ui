---
slug: molcrafts-ui-chart-element-01
title: Optional Vega-Lite chart custom element
status: in-progress
created: 2026-10-11
product: molcrafts-ui
language: en
---

# molcrafts-ui-chart-element-01 — Chart custom element

## Summary

Add an optional custom element that renders one official Vega-Lite spec without React and without MolPlot. The molpy docs fence emits `<molcrafts-chart>`. This spec does not move MolPlot's editor and does not register an alias of `<molplot-chart>`.

The element lives with the optional chart packages. `@molcrafts/ui`, `@molcrafts/ui-tokens`, and the existing Fluent tags in `@molcrafts/ui-web-components` stay free of Vega and Vega-Lite.

## Domain basis

`<molplot-chart>` in MolPlot already drops a Vega-Lite spec into HTML. The spec is a child `<script type="application/json">`, or a one-line `spec` attribute. Attributes in use are `preset`, `theme` (`auto` | `light` | `dark`), `interactive`, and `aspect` (`4:3`, `4/3`, or a number). `interactive="false"` turns off pan and zoom. The default aspect is 4/3. Invalid JSON renders an inline error and does not throw.

`@molcrafts/ui-vega` renders official Vega specs through the View API. `@molcrafts/ui-vega-lite` compiles Vega-Lite onto that same viewer. Both are React components. The Vega package README states that the web-components package is not chart parity. [Chart architecture](../../docs/chart-architecture.md) leaves native chart registration as a later task. CI already uses `VegaLiteView` for its trend sparkline and does not need this element.

## Design

### Package boundary

Register the element from `@molcrafts/ui-vega-lite`, which already depends on `@molcrafts/ui-vega`. Do not add a Vega dependency to `@molcrafts/ui` or `@molcrafts/ui-web-components`. Do not re-export the element from the core UI package. The tag is `<molcrafts-chart>`. It is not an alias of `<molplot-chart>`.

### Author contract

```html
<molcrafts-chart preset="molplot" theme="auto" aspect="4:3" interactive="false">
  <script type="application/json">
  { "mark": "line",
    "data": { "values": [ {"x":0,"y":1}, {"x":1,"y":2} ] },
    "encoding": { "x": {"field":"x","type":"quantitative"},
                  "y": {"field":"y","type":"quantitative"} } }
  </script>
</molcrafts-chart>
```

- The body is an official Vega-Lite spec. There is no second spec language.
- `theme` follows `auto` | `light` | `dark`. `auto` follows the nearest light/dark scope.
- `aspect` sets the width:height ratio. Width follows the container. Missing `aspect` uses 4/3.
- `interactive="false"`, `0`, `off`, or `none` disables pan and zoom. The default is interactive.
- Empty and invalid JSON show an inline error on that element only.
- A required accessible name comes from a `label` attribute. `label-hidden` keeps the name without drawing a title.
- Loading, empty data, and failure have their own status text. A failed spec does not leave a previous view on screen.

### Explicitly out of this element

MolPlot keeps these, and this element does not grow them:

- `appendPoint`, `appendPoints`, `setSeries`, `setWindow`, and per-series click handling
- axis-gutter zoom behavior owned by MolPlot `RawChart`
- the figure editor: selection, artist tree, inspector, rulers, undo
- matplotlib and twin axes

### Preset

`preset` selects a named chart theme once [molcrafts-ui-preset-theme-01](molcrafts-ui-preset-theme-01.md) defines that theme. Until then, the element renders with the viewer's inherited product theme and does not invent a second copy of `presets/molplot.json`.

## Files

Implementation, when authorized, is limited to the optional Vega-Lite package, its registration entry, and tests. No MolPlot, molpy, or docs-theme edits belong to this spec.

## Out of scope

Publishing, release tags, compatibility aliases for `<molplot-chart>`, and replacing CI's `VegaLiteView`.
