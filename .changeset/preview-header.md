---
"@molcrafts/ui": patch
---

Add `PreviewHeader` and `PreviewNotice`, the header MolPlot charts, MolVis viewers and sketch boards show in a report, built from IconAction, Tooltip, Separator and DropdownMenu. Actions are declarative (button, toggle, menu) in fixed groups, fold into More when narrow, share one tab stop and take one-key shortcuts; read-only drops actions marked `mutates`. `@molcrafts/ui/preview` mounts both from non-React code inside a shadow root. `IconAction` takes an optional `shortcut` shown in its tooltip.
