---
"@molcrafts/ui-vega": patch
"@molcrafts/ui-vega-lite": patch
---

`<molcrafts-chart>` fills its host and measures the host instead of the surface Vega sizes, so a chart no longer grows on every resize. A host size wins over a numeric `height`/`width` in the author spec, and nominal axis labels stay horizontal.
