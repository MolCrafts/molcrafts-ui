# MolCrafts design system — repository rules

## Authority and current stage

Read [the refactoring spec](docs/design-system-refactoring-spec.md),
[roadmap](docs/design-system-roadmap.md), and
[design constitution](docs/design-constitution.md) before shared UI work.
The new spec supersedes the historical registry-first distribution direction.
Implementation is authorized. Check the roadmap for completed boundaries and remaining work.
Future project name: `molcrafts-design`. Package names and repository rename are deferred.
Do not publish packages, create release tags/releases, enable automatic publishing, or
rename external resources without a subsequent release task.
User instructions take precedence over these repository rules.

## Architecture

- Own component APIs, visual styling, tokens and themes; reuse mature headless behavior.
- Use the Rspack ecosystem: Rslib libraries, Rsbuild development, Storybook Rsbuild.
- Use the pnpm workspace, React/TypeScript, Tailwind v4, CSS runtime tokens.
- Prefer Base UI for new complex interactions; retain functioning Radix components.
- Tokens must not depend on React, primitives or applications. Packages never import apps.
- Applications consume public package exports and compiled CSS, without
  scanning library source.
- Keep one canonical implementation. Registry contains package setup/examples, not copied core sources.
- Web Components are an independent managed runtime sharing tokens, not React rendering
  across frameworks. Do not claim React API parity or register elements during SSR.
- Avoid product-domain UI and premature utility/icon/category packages.

## Design and component work

Inspect existing implementations, public contracts and Storybook examples first.
Follow Fluent 2, MolCrafts semantic tokens, complete product primary/secondary families,
light/dark themes and documented variants. Read [theming](docs/theming.md),
[token catalog](docs/token-catalog.md) and [style audit](docs/style-audit.md). Use
ThemeScope for React scopes and overlays; provide complete mode-specific brands.
Use official Fluent icons.
Prefer icon-only for familiar toolbar actions; require accessible names and visible
help, retain text for ambiguous actions and important confirmations.
Document relevant props, variants, sizes, controlled/uncontrolled behavior, refs,
native attributes, keyboard behavior, disabled/loading/invalid states and extension points.
The owner explicitly requires no backward compatibility: do not add old-import shims,
source-sync adapters, deprecated token aliases or product-specific merge scales.
Preserve predictable class merging; avoid raw colors and internal DOM override contracts.
Update stories/docs with shared changes. Separate structural migration from redesign.

## Current commands and validation

Use Node 24+ and pnpm 11.25.0. Implementations live in packages; stories live in apps/storybook.

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm verify:packages
pnpm build:registry
pnpm build:catalog
pnpm build:consumer
pnpm test:consumer
pnpm verify:consumer-tarball
pnpm test:web-components
pnpm build:storybook
pnpm test:storybook
```

Browser tests require Playwright Chromium installed. Token/registry/native generation
must leave committed generated sources consistent; edit generators rather than outputs.
Use relevant checks for the actual change; documentation-only preparation needs link,
consistency and diff checks, not new component tests.
The old source-sync workflow is removed; product migration belongs in product PRs. Record missing coverage
and real-product verification honestly; future fixture tests do not prove product migration.
