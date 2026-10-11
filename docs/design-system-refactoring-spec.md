# MolCrafts UI System Refactoring Spec

Version: 1.0 · Status: Implementation authorized; incremental delivery
Date: 2026-10-10 · Scope: current `MolCrafts/molcrafts-ui` repository
Future project name: **molcrafts-ui**

This specification consolidates the user-provided v1.0 and incorporates the previously confirmed Fluent 2, product brand colors, icons, and
Web Components requirements. On 2026-10-10 the user subsequently authorized implementation and explicitly required no backward compatibility; that decision supersedes the original v1.0
Preserve compatibility requirement. Actual completion scope follows the roadmap; nothing has been published.
Implementation order is in [roadmap](design-system-roadmap.md); current status is in
[pre-implementation audit](design-system-readiness.md).

## 1. Vision and ownership

Evolve the shadcn-derived component collection into an independent, reusable, Agent-friendly React Design System.
MolCrafts owns the visual language, tokens, themes, public APIs, style contracts, and versioning process.
Share foundational UI across products without depending on any single product's layout, data model, or business logic.
Principle: Own the design, reuse the infrastructure.

[Design constitution](design-constitution.md) is the concrete visual contract; this document defines engineering and distribution boundaries.
The old Registry specification is retained as a historical record. Its Registry-first, npm-optional direction is superseded by this specification.
Do not keep old imports, old source distribution, old token aliases, or sync adapters; products migrate directly to the new entry points.

## 2. Technology decisions

| Layer | Technology | Contract |
| --- | --- | --- |
| UI | React + TypeScript | MolCrafts owns the public component APIs |
| Styling | Tailwind CSS v4 | CSS is generated at build time; consumers do not need to scan library source |
| New complex interactions | Base UI | Prefer mature headless behavior; introduce it as needed |
| Existing interactions | Radix UI | Keep implementations that work; migrate incrementally |
| Tokens / themes | CSS Custom Properties | Framework-agnostic runtime theme source |
| Library build | Rslib | JS, type declarations, CSS assets, and explicit exports |
| Development / documentation | Rsbuild + Storybook Rsbuild | Use the Rspack ecosystem |
| Workspace | pnpm | Pinned versions and a single workspace lockfile |
| Future primary distribution | npm-compatible versioned packages | Not published in this round |
| Agent / optional source integration | Skills + shadcn Registry | Static discovery and integration scaffolding |

The component library does not introduce Next.js, Vite, or other application frameworks. Do not replace every Radix component merely to unify them,
and do not add dependencies that have no current use case merely for architectural completeness.

## 3. Architecture and dependency rules

Directory boundaries (established; concrete component ownership is still implemented in batches):

```text
packages/tokens/           # CSS, themes, and Tailwind integration
packages/ui/               # React components, variants, and public APIs
packages/vega/             # Optional Vega runtime + React viewer
packages/vega-lite/        # Optional compiler that reuses the Vega viewer
packages/web-components/   # Existing independent native implementation that shares tokens with React
apps/storybook/            # Component development and documentation
registry/                 # Optional configuration, examples, and integration entry points
skills/molcrafts-ui/       # Portable Agent guidance
docs/                     # Specifications, decisions, migration, and the component catalog
```

The user has confirmed `@molcrafts/ui-tokens`, `@molcrafts/ui`, and
`@molcrafts/ui-web-components`, plus MIT; in-repository package names and imports are already unified.
`molcrafts-ui` is the project name. External GitHub rename, domains, hosting, and npm publish permissions
still need to be checked in the actual rename/release task. See [rename plan](rename-plan.md) and [release preparation](releasing.md).
Do not implicitly modify the external GitHub repository, npm identity, or real products.

1. tokens do not depend on React, Base UI, Radix, or applications.
2. ui may depend on tokens, headless primitives, and necessary runtime utilities.
3. Applications consume components through public package entry points and do not import implementation source.
4. Packages do not import consumer applications and do not depend on application-level aliases, Tailwind scanning, or implicit global configuration.
5. Circular dependencies are forbidden; utilities, icons, and component categories are not split into packages yet.
6. Optional chart boundaries are in [chart architecture](chart-architecture.md): core UI/tokens do not depend on Vega;
   design-vega uses the View API, and design-vega-lite only compiles and reuses the Viewer; neither depends on MolPlot.
7. Web Components have an independent runtime and distribution boundary and may be kept independently; they do not reference the React implementation.

## 4. Design tokens and Fluent 2 themes

Adopt the current stable Fluent 2 Web visual style and use official Fluent Icons.
"latest" means periodically checking the stable release and reviewing upgrades; it does not mean depending on a floating `latest`.
Official tokens are a reference and a generation input; MolCrafts CSS slots, mappings, defaults, and upgrade
decisions are its own design contract. Unverified upstream updates must not directly change product visuals.

Foundation tokens cover color, typography, spacing, size, borders, radius, shadows, elevation,
motion duration and curves, focus indicators, and interaction states. Semantic tokens cover background, surface,
foreground, border, primary, secondary, muted, accent, success, warning, danger,
info, plus hover, active/pressed, disabled, and focus.

- CSS custom properties are the runtime source; Tailwind v4 consumes them through `@theme` mappings.
- Components primarily reference semantic tokens and do not hard-code default shadcn color values or arbitrary visual constants.
- The first stage supports light/dark; themes are independent of business logic, and switching does not require a rebuild.
- Support scoped product themes. Each product owns a complete primary / secondary color family and light/dark states.
- Neutral secondary actions are separate from the second brand color, and status colors are not overridden by brand colors.
- Portal overlays of a scoped theme must keep the correct scope and are verified in Storybook.
- Do not invent component-specific tokens arbitrarily; exceptions must be a reusable concept or a documented customization contract.
- Keep reduced-motion, forced-colors, and text/control/focus contrast requirements.

Familiar actions such as toolbars prefer icon-only buttons; they must provide an accessible name and a visible hint.
Hard-to-recognize actions, destructive confirmations, and critical submissions keep text. Use official Fluent icons uniformly. React
uses React icons, native implementations use the corresponding SVG icons, and icons are not split into a separate package.

## 5. Component contracts

Each public component documents explicit TypeScript props, variants, sizes, relevant controlled/uncontrolled behavior,
keyboard and accessibility behavior, states such as loading/disabled/invalid, refs, and native attribute support.
Simple components use direct props; complex components use a composable API.
Do not turn unnecessary Base UI/Radix details into long-term public API commitments; evaluate existing exposures one by one, and do not keep an unnecessary API for compatibility.

Component visual styling belongs to the component library. Support predictable className merging and purposeful variants, slots,
and token extension, and avoid requiring consumers to override large areas through internal DOM selectors.
Use standard CSS when needed; avoid unnecessary runtime CSS-in-JS.
Structural migration should avoid unrelated behavior and visual changes; deleting an old contract provides no compatibility layer, and changes are recorded explicitly.

## 6. Distribution, naming and releases

The target primary distribution is versioned npm-compatible packages. Rslib builds React ESM, type declarations, and
CSS; explicitly declare exports, React peer dependencies, files, and the CSS entry.
Verify CSS import closure, tree shaking, and real side effects such as registration and CSS.
Consumers must not compile the library's Tailwind source and must not depend on source aliases.

This round only prepares local build/pack verification and the version, changelog, upgrade, and release processes.
**Do not run npm publish, do not create release tags/releases, do not configure automatic publishing, and do not rename early.**
A formal rename must jointly check the repository, package manifests/exports, internal dependencies, documentation examples,
Registry URLs, CI/artifact names, and the old-import migration plan, and only then schedule the first publish.
APIs, tokens, and style contracts are managed by semver; renaming is not permission to break behavior.

The Registry is not the primary distribution mechanism for core components. It may keep configuration, examples, templates, compositions, and Agent
scaffolding, and it prefers references to canonical packages. Do not maintain separate component implementations for npm and the Registry.
Delete core-source Registry items and keep only package configuration and examples; record the new integration method.

## 7. Agent-native development

Maintain the root `AGENTS.md`, the portable `skills/molcrafts-ui/SKILL.md`, documentation based on TypeScript/Storybook,
and a component catalog that includes names, purpose, imports, examples, and status.
Agent workflow: look up existing components first, then read the public API and stories, and prefer reuse; use semantic tokens
and existing composition patterns; a new UI dependency or default shadcn styles needs a sound reason; shared changes update
stories/docs together; verify types, builds, interaction, and visuals.

Prefer static files in version control and the CLI. Do not build a custom index service or MCP server.
Storybook MCP can be evaluated later and is not a prerequisite for the baseline workflow.

## 8. Storybook and quality gates

Storybook is the primary development environment. Every migrated public component has a story, and Autodocs is enabled when appropriate.
`pnpm verify:stories` fails when a Storybook entry is missing. Visual review follows Impeccable's target rules:
bare `/impeccable` only recommends commands from changed markup/styles; `critique` and `audit`
take one story file or iframe; `polish` reuses that target's critique snapshot until its bytes change.
A full sidebar pass happens only when explicitly requested, and each critique is still one target. Each story should still cover the default,
every supported variant/size, light/dark, relevant states, accessibility behavior, and typical compositions.

Quality checks cover types and public type exports, unit/interaction tests for complex behavior, keyboard,
accessibility, visual regression for key components, package builds, and consumer integration.
The standalone Rsbuild fixture imports only build artifacts and compiled CSS and does not scan library source; a local
tarball install additionally verifies exports/files/dependency closure. Real-product verification is evidenced separately by a product PR,
and the fixture cannot replace real-product compatibility acceptance. Native implementations continue to use independent HTML/browser verification.

## 9. Migration strategy

1. Audit and foundation: component/API/dependency/token audit, pnpm boundaries, Rslib,
   semantic themes; remove old entry points and do not add compatibility adapters.
2. Component ownership: establish contracts in batches, migrate semantic styles, keep working Radix, adopt
   Base UI as needed, and align variants and extension points.
3. Documentation and Agent support: migrate Storybook entry points, fill in stories/catalog and
   AGENTS/Skill, and establish a11y/visual checks.
4. Distribution and integration: verify artifacts, standalone Rsbuild, and real-product migration, and prepare version
   and upgrade processes. Actual publishing comes after a future rename and release plan and is outside the current authorization.

Concrete PR order, reasons, development impact, and exit criteria are in the roadmap.

## 10. Non-goals

Do not redesign every component at once; do not replace all of Radix; do not add a new styling framework; do not build a custom Registry
engine, MCP, or index; do not put product routing, authentication, SSR, or business logic here; do not try to render React
across runtimes. Web Components are an existing independent implementation that shares tokens and is not required to be feature-equivalent.

## 11. Acceptance criteria and evidence

| # | Criterion | Required evidence |
| --- | --- | --- |
| 1 | MolCrafts owns tokens, themes, styles, and APIs | Constitution, token contract, and public export documentation |
| 2 | Migrated components leave default shadcn design conventions | Component review and light/dark visual comparison |
| 3 | Runtime themes are consistent and do not require a rebuild | Global/scoped/portal/brand-switch stories and tests |
| 4 | UI packages are built with Rslib | CI artifacts and type, CSS, and exports checks |
| 5 | Standalone Rsbuild consumption needs no source scan | Build-artifact and tarball consumption verification |
| 6 | Every migrated public component has Storybook documentation | Coverage item by item against the export list, not a story-count substitute |
| 7 | Agents can discover APIs without knowing shadcn | AGENTS, Skill, catalog, and runnable examples |
| 8 | Relevant type, interaction, a11y, and visual checks pass | CI and baseline evidence for the corresponding batch |
| 9 | Products work correctly after migrating to the new entry points | Real-product migration PRs and compatibility checks; not yet verified |
| 10 | Version and upgrade processes are reproducible | release/rename docs and a local rehearsal; publishing is not required this round |

## 12. Implementation principles

Own the design. Reuse behavior. Use explicit migrations without compatibility shims. Publish once.
Keep Agents informed. Avoid premature infrastructure. Keep the system product-independent.
Each migration batch must record completed scope and remaining items. A passing baseline build is not a claim that the whole refactor is done.
