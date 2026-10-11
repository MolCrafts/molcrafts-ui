# molcrafts-ui implementation roadmap

Date: 2026-10-10 · Current stage: P1 merged (PR #6, ded1b1e); P2 merged (PR #7, 3e1d2dc); release preparation merged (PR #8); currently implementing optional charts and the CI dashboard migration.
On 2026-10-10 the user required no backward compatibility, superseding the compatibility clauses in the original roadmap.
Based on: [Refactoring Spec v1.0](design-system-refactoring-spec.md).
This file describes future work; unchecked items are not implemented. Stages proceed by dependency and do not preset dates.
Implementation is authorized; the user confirmed the @molcrafts/ui package names and MIT. In-repository naming and release preparation are allowed;
do not publish and do not implicitly modify external resources; the project name is `molcrafts-ui`.

## Current preparation delivery P0

- [x] Unify the user specification and the existing Fluent 2 / product brand / icon / native-implementation requirements into the spec.
- [x] Record existing source, builds, documentation coverage, and migration risks.
- [x] Establish the roadmap, root AGENTS, and the portable Skill.
- [x] Update README, CLAUDE, and the old-spec entry points, distinguishing the current implementation from the target architecture.
- [x] Re-verify types, generation, the native package/tests, and the Storybook baseline before implementation.
- [ ] Real-product API usage and migration verification still await a product PR.

Documentation delivery is not evidence that pnpm, React package distribution, or product-compatible migration is complete.

## PR 1 / P1 — Workspace and package-build foundation

**What changes**

- [x] Pin pnpm, establish the workspace and a single lockfile; align the CI install method.
- [x] Establish tokens/ui logical boundaries, move the single implementation into packages, and update internal imports.
- [x] Rslib emits JS, public types, and compiled CSS, and declares exports/peers/files/sideEffects.
- [x] Move Storybook into apps/storybook, consume it through public entry points, and keep Rsbuild/Rspack.
- [x] Make Web Components depend on shared token assets and remove the independent source of truth created by hand-copying.
- [x] Adjust Registry/sync-script paths and delete the old source-sync and compatibility flow; do not modify external products.

**Why**: Establish verifiable module and distribution boundaries and expose implicit aliases, dependencies, and source-scan requirements.

**Downstream impact**: New shared implementations live only in packages; applications and stories no longer read internal source.
Consumers use component entry points and compiled CSS; utilities and icons stay inside the component package.

**Exit criteria**: A clean install, types, package builds, generation consistency, and Storybook pass; existing stories render and complete their existing play functions, and key control size/theme/interaction pass consumer checks;
exports and the CSS entry can be resolved from an independent process. Full visual regression still waits for a later stage.
Do not add a compatibility shim; old entry points, old aliases, and product-specific extensions are deleted directly, and new integration docs are provided.

## PR 2 / P2 — Design tokens and theme contract

- [x] Complete the foundation/semantic inventory, descriptions, and sources, and remove deprecated aliases.
- [x] Fix the MolCrafts-owned mappings and the upstream-version review process, keeping the current Fluent 2 baseline.
- [x] Separate the pure CSS runtime entry from the Tailwind v4 integration.
- [x] Verify light/dark, product primary/secondary, scoped themes, and portal inheritance.
- [x] Audit raw color values, arbitrary sizes, and mixed brand and status colors; record the batch-handling scope.
- [x] Verify forced-colors, reduced-motion, and state and focus contrast.

**Why**: Make every runtime share the design contract so a product only supplies its own brand and theme configuration.

**Downstream impact**: New component styles prefer semantic roles; products do not need to override internal DOM.
A new token must express reusable semantics or an explicit customization contract.

**Exit criteria**: tokens have no React/primitive/application dependencies; themes need no rebuild; the same
brand theme applies consistently in React and existing native controls; visual changes have a separate record.

## PR 3+ / P3 — Component ownership in batches

Batches may be adjusted from audit results. Each batch independently completes the API, stories, related tests, and migration notes.

| Batch | Initial scope | Why / downstream impact |
| --- | --- | --- |
| A | Button, Badge, Input, Label, Textarea, Card | Fix basic sizes, states, brand, and icon-only rules for later composition reuse |
| B | Checkbox, Switch, Select, NumberField, Slider | Stabilize form controlled/uncontrolled, invalid, disabled, ref, and keyboard contracts |
| C | Dialog, AlertDialog, Sheet, Popover, Tooltip, menus | Verify focus management, portals, themes, and dismiss behavior, and keep working Radix |
| D | Tabs, Accordion, Collapsible, Command, and the remaining primitives/blocks | After base contracts are stable, handle composition, layout, and leftover product coupling |

- [ ] Record props, variants, sizes, slots, and leaked implementation details against the public export list.
- [ ] Migrate styles to MolCrafts semantic tokens; keep predictable className merging.
- [ ] Evaluate Base UI for complex new interactions as needed; do not replace working Radix for uniformity.
- [ ] For breaking API/visual changes, provide before/after examples, the new entry points, and upgrade notes.
- [ ] Separate product-specific extensions in utils from the shared contract, delete the product-specific extensions, and let products migrate their own configuration.

**Exit criteria**: Each batch's public exports have a contract and stories; related type, keyboard, interaction, a11y, and
key visual checks pass; unmigrated components are explicitly marked, and the whole library is not claimed complete.

## PR 4 / P4 — Documentation, Agents, and coverage checks

This stage can ship with P3 batch by batch, with a final concentrated check for omissions.

- [ ] A complete component catalog: name, purpose, public import, minimal example, status, and story.
- [ ] Migrated public components cover default/variants/sizes/themes/states/compositions/important a11y behavior.
- [ ] Autodocs matches public types, and examples do not import internal implementations.
- [ ] AGENTS/Skill use the final workspace commands and package names and do not keep outdated guidance.
- [ ] Optional Registry items reference canonical packages and keep a single implementation.

**Why and impact**: Developers and Agents can discover before they reuse; shared component changes update documentation together.

**Exit criteria**: Repository docs are enough to find components, integrate them, configure themes, and build common compositions; check coverage
against public exports, and do not merely count story files.

## PR 5 / P5 — Standalone consumption and quality gates

- [x] The standalone Rsbuild fixture uses only build exports and compiled CSS, with no library source scan.
- [x] A local tarball install verifies JS, types, CSS, runtime dependencies, and assets.
- [x] Nontrivial interaction/keyboard/a11y checks are in CI, and the way key visual baselines are updated is explicit.
- [x] Continue maintaining Web Components native HTML, form, registration, and theme browser tests.
- [ ] Choose one real MolCrafts product and verify functional compatibility and migration in a separate product PR.
- [x] Record the new imports/Registry usage; old entry points get no compatibility window.

**Why and impact**: Distinguish "the repository runs" from "products can consume it," and find gaps before product integration.

**Exit criteria**: Artifact-consumption CI passes; the real product has explicit test evidence. Until the product PR is done,
library infrastructure may ship, but product-compatibility acceptance for the whole refactor stays incomplete.

## P6 — molcrafts-ui naming and release preparation

- [x] Decide the npm scope, React/tokens/native package names, subpaths, and the version starting point.
- [x] Inventory repository URLs, Registry URLs, CI/artifacts, docs, and product imports.
- [x] Plan a unified rename PR and provide direct migration notes; do not assume a GitHub redirect replaces API migration.
- [x] Write semver, changeset/changelog, upgrade, rollback, and reproducible release documentation.
- [x] Rehearse local packing and confirm the license, third-party attribution, and the published file set.

**Why and impact**: Avoid publishing the old name and migrating later; give consumers a consistent, traceable entry point.

**Exit criteria**: The rename plan and release artifacts can be reviewed. There is no publish step now, and every package stays
not auto-publishable; real publishing, tags/releases, and automatic publishing configuration are scheduled separately.

## Implementation discipline for every PR batch

State the completed scope, API/style changes, product-migration impact, verification, and unresolved items. Keep structural and visual changes
separate when possible; merge in dependency order. A green CI cannot replace public-contract and product-compatibility evidence.
Do not substitute source sync for a real product PR, and do not claim that Web Components are React API equivalents.

## P1 verification record (2026-10-10)

Local: pnpm install and the public typecheck, Rslib package builds, exports/module/CSS/SSR checks,
the standalone Rsbuild build, and a tarball build in an external temporary directory passed; consumer browser checks passed, and the native
5 tests passed; render/play for all 35 existing stories and Button Autodocs passed.
P1 CI passed and PR #6 was merged. Nothing was published, renamed, or changed in external products.

A small amount of later foundation work was also done early: deprecated token aliases were removed, product-specific cn scales were cleared,
the component catalog was generated, and artifact-consumption and story smoke gates were established. P3/P4/P5 are not complete as a whole.
P2 has filled in scoped-theme portals and the first a11y/visual checks; full API/state coverage, whole-library visual coverage, and real-product acceptance are still unfinished.

## P2 verification scope (2026-10-10)

127 token metadata entries and docs; ThemeScope and nearest-host inheritance for 8 overlay kinds; native nested light/dark modes.
The standalone consumer's 7 tests cover keyboard, axe contrast, runtime brand/size, reduced motion, high contrast,
and 3 screenshots; the native package has 6 tests. See [theme contract](theming.md) and
[style audit](style-audit.md). Builds, public types, the external tarball, render/play for 39 stories, and Autodocs passed locally;
P2 CI was fully green and PR #7 was merged. Real products are not yet verified, and there has been no publish or external rename.

## Pre-publish preparation scope (2026-10-10)

The user confirmed the @molcrafts/ui package names and MIT, and in-repository naming plus direct migration docs are done.
Changesets are configured for unified versions; 0.1.0-alpha.0 and changelogs were rehearsed in a temporary workspace,
while the actual workspace version remains the unpublished 0.0.1 and the three packages stay private. Pack manifests/exports/licenses/
dependency rewriting/checksums, and typechecking plus React/native Rsbuild consumption of the three tarballs outside the repository, are in CI.
See [release preparation](releasing.md) and [rename plan](rename-plan.md). External repository rename, npm
publish permissions, component acceptance scope, real-product integration, and an actual candidate release are still unfinished.

## Optional charts and the first real consumer

Based on: [chart architecture](chart-architecture.md). The user authorized adding a Vega component library and migrating the CI dashboard.

- [x] Establish design-vega / design-vega-lite, with a one-way dependency between Runtime and Compiler.
- [x] Viewer lifecycle, theme, signals/data, SVG/Canvas, and export contracts, plus stories.
- [x] Browser interaction/theme/accessibility checks and verification that native-only compile dependencies are isolated.
- [ ] The real CI product PR finishes compiled CSS, public imports, charts, and Fluent icon integration.
- [ ] Product browser acceptance and exact-commit CI across the two repositories are complete.
- [ ] MolPlot migration and native Web Components chart support (a later task).

This round still does not publish; fixed-tarball distribution and verification for the unpublished stage are in the chart architecture.

### Typography and density revision (2026-10-10)

Compact-first guidance is withdrawn. Default controls are 40px, large controls 48px; product navigation must provide at least 40px rows. UI fonts use platform sans fallbacks; metrics use tabular figures rather than monospace. React and native controls share this contract. Dashboard migration validates comfortable navigation in the real consumer.
