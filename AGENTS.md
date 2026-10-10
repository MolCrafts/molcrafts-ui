# MolCrafts design system — repository rules

## Authority and current stage

Read [the refactoring spec](docs/design-system-refactoring-spec.md),
[roadmap](docs/design-system-roadmap.md), and
[design constitution](docs/design-constitution.md) before shared UI work.
The new spec supersedes the historical registry-first distribution direction.
The current task is implementation preparation; roadmap targets are not implemented facts.
Future project name: `molcrafts-design`. Package names and repository rename are deferred.
Do not publish packages, create release tags/releases, enable automatic publishing, or
rename external resources as part of this preparation.
User instructions take precedence over these repository rules.

## Architecture

- Own component APIs, visual styling, tokens and themes; reuse mature headless behavior.
- Use the Rspack ecosystem: Rslib libraries, Rsbuild development, Storybook Rsbuild.
- Target pnpm workspace, React/TypeScript, Tailwind v4, CSS runtime tokens.
- Prefer Base UI for new complex interactions; retain functioning Radix components.
- Tokens must not depend on React, primitives or applications. Packages never import apps.
- Applications eventually consume public package exports and compiled CSS, without
  scanning library source. Do not claim this boundary exists before migration.
- Keep one canonical implementation. Registry becomes optional integration support.
- Web Components are an independent managed runtime sharing tokens, not React rendering
  across frameworks. Do not claim React API parity or register elements during SSR.
- Avoid product-domain UI and premature utility/icon/category packages.

## Design and component work

Inspect existing implementations, public contracts and Storybook examples first.
Follow Fluent 2, MolCrafts semantic tokens, complete product primary/secondary families,
light/dark themes and documented variants. Use official Fluent icons.
Prefer icon-only for familiar toolbar actions; require accessible names and visible
help, retain text for ambiguous actions and important confirmations.
Document relevant props, variants, sizes, controlled/uncontrolled behavior, refs,
native attributes, keyboard behavior, disabled/loading/invalid states and extension points.
Preserve predictable class merging; avoid raw colors and internal DOM override contracts.
Update stories/docs with shared changes. Separate structural migration from redesign.

## Current commands and validation

Current repository still uses npm and root `src/` / `.storybook/`:

```sh
npm ci
npm run typecheck
npm run build:tokens
npm run build:registry
npm run build:web-components
npm run test:web-components
npm run build:storybook
```

Browser tests require Playwright Chromium installed. Token/registry/native generation
must leave committed generated sources consistent; edit generators rather than outputs.
Use relevant checks for the actual change; documentation-only preparation needs link,
consistency and diff checks, not new component tests.
Do not run `sync:products` without a task explicitly including sibling product changes.
Update these commands when the pnpm migration actually lands. Record missing coverage
and real-product verification honestly; future fixture tests do not prove product migration.
