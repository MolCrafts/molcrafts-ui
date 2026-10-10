---
name: molcrafts-design
description: Discover, compose and extend MolCrafts shared UI using its public APIs, Fluent 2 design constitution, semantic themes and Storybook examples.
---

# MolCrafts Design

This is a vendor-neutral repository skill. Resolve paths from the repository root;
it requires no custom MCP server or prior shadcn knowledge.

## Discover before implementing

1. Read `AGENTS.md`, `docs/design-system-refactoring-spec.md` and
   `docs/design-constitution.md`. Check `docs/design-system-readiness.md` for actual
   capabilities and `docs/design-system-roadmap.md` for planned work.
2. Read `docs/component-catalog.md`, public package exports and Storybook examples
   in `apps/storybook/src`. The canonical implementation lives in `packages/ui`.
   Consume `@molcrafts/design` and compiled `styles.css`, not internal source paths.
3. Read the selected component's TypeScript props and relevant stories before composing.
   Prefer existing components and documented variants over custom controls.

## Compose and extend

Use semantic CSS tokens, Fluent 2 geometry, official Fluent icons, full product
primary/secondary families and documented theme scopes. Read `docs/theming.md`,
`docs/token-catalog.md` and `docs/style-audit.md`; use `ThemeScope` for React scoped
overlays and pass mode-specific complete brands. Keep status colors independent.
Icon-only toolbar actions need accessible names and visible help; ambiguous or important
confirmations keep text. Check keyboard behavior, theme/portal inheritance and refs.
Do not introduce default shadcn styling, new UI dependencies or internal DOM selectors
without a documented reason. Keep application business logic out of shared components.
Retain working Radix behavior; evaluate Base UI for new complex interactions.

Shared changes update API documentation, relevant states/variants and Storybook examples.
Avoid leaking primitive implementation details into new public contracts.
Web Components have independent native APIs; inspect their package README, manifest and
stories. They share tokens, not React rendering or full API parity.

## Validate and report

No backward compatibility is required: do not restore deleted source paths, token
aliases, product-private merge extensions or core-source Registry distribution.

Use the current commands in `AGENTS.md`. Validate builds and types, plus interactions,
keyboard, accessibility and visual behavior relevant to the change. Check built-package/tarball consumption without library Tailwind scanning.
Report completed scope, compatibility changes, validation evidence and remaining gaps.
Do not describe roadmap items as shipped. Confirmed package names are `@molcrafts/design`, `@molcrafts/design-tokens` and
`@molcrafts/design-web-components`, with MIT licensing. Read `docs/releasing.md`;
local release preparation does not authorize publishing or external repository renaming.
