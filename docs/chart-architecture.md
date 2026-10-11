# Optional plotting architecture

2026-10-10 · Implementation authorized · Private packages; no publishing.

The project/package family remains **molcrafts-ui**, not the historical ui names.
`ui/plot` describes optional plotting capabilities; there is no core-root re-export
that implicitly loads engines. Two real consumers (CI and MolPlot, plus future Molab)
justify these independent dependency boundaries inside the existing monorepo.

```text
Application / MolPlot editor / CI data-to-spec mapping
    ├── @molcrafts/ui (core controls)
    ├── @molcrafts/ui-vega-lite → Vega-Lite compiler
    │           └── @molcrafts/ui-vega → Vega parse + View → SVG / Canvas
    └── @molcrafts/ui-tokens (shared CSS runtime)
```

Vega-Lite is a compiler producing official Vega specs, not a second renderer.
Native Vega consumers do not load the compiler. The base Viewer uses Vega's View API
and does not depend on vega-embed or MolPlot. There is no additional Vega IR.
Core UI and tokens do not depend on either plotting package. Imports under Node are
safe; runtime initialization waits for a mounted browser host. Engine and compiler
imports are asynchronous; route-level lazy loading and bundle graph checks confirm
the native build excludes the compiler. A package split alone does not prove this.

The Viewer owns View lifecycle, stale async generations, resize, signal/data updates,
exports, inherited theme and safe text tooltips. Specs own data meaning and palettes.
The compiler adapter owns compilation and reuses the exact Viewer. Contracts/examples:
[Runtime](../packages/vega/README.md), [Lite](../packages/vega-lite/README.md),
[stories](../apps/storybook/src/charts/vega.stories.tsx),
[browser tests](../tests/consumer/charts.spec.ts).

MolPlot should consume these components for figure rendering and retain Selection,
Artist Tree, Property Inspector, Undo/Redo and scientific presets. Its actual migration
is outside this batch. Molab can use either Viewer without importing a figure editor.
MolVis retains molecular/domain interaction. React is not rendered through existing
Web Components; native chart registration/adapter support is a subsequent managed
runtime task and is not implemented in this delivery.

CI dashboard is the first real migration: delete source-sync/vendored primitives;
consume built package APIs/CSS, NativeSelect and official Fluent icons; replace MolPlot
with VegaLiteView. Snapshot parsing, verdict semantics, coverage sorting, URL/deep links,
plugin registration and product layout composition stay in CI. No compatibility shims.
Product primary/secondary colors are complete light/dark families; shared visual values
and status roles come from Design tokens.

## Unpublished consumer installation

Until publishing is separately authorized, the CI product PR commits four immutable
local tarballs (tokens/core/runtime/compiler) with their producer SHA and SHA-256 hashes.
These are compiled package artifacts, not independently maintained component sources.
`npm ci` installs from the repository and does not run the Design workflow, clone a
moving branch, or depend on temporary Actions downloads. Review/version their refresh
as a coherent set. A verifier checks archive hashes, exported files, packed package
names/versions and exact internal dependency versions. The npm lockfile pins transitive
engines and normal dependencies. Switch file dependencies to explicit npm versions in
a future publishing task, then remove local archives; do not install both sources.

This avoids a CI bootstrap cycle: producer core checks are independent; consumer
validates fixed built artifacts; future producer report/submit Actions depend only on
pinned CI CLI/Actions, never dashboard build/deployment. No change in this batch enables
publishing, release tags, workflow recursion or CI Actions adoption.
