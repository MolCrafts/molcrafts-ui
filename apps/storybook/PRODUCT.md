# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Product engineers building molexp, molvis, or molhub. They open Storybook to check a shared component, token, theme, or pattern, then consume the public package in that product.

## Product Purpose

MolCrafts Design (`molcrafts-design`) is the shared UI for molexp, molvis, and molhub. It gives those products one owned component, token, and theme contract.

Storybook (`apps/storybook`, `@molcrafts/storybook`) is the documentation and playground for that system. It stays a private workspace app. Success is a product engineer finding the public component, token, or theme in Storybook and consuming the built package correctly.

The consumer fixture in this repository shows that a clean app can install and build the packages. Migration of molexp, molvis, and molhub is still unverified.

## Positioning

MolCrafts owns the component APIs, semantic tokens, themes, and Fluent 2 visual contract, and reuses mature headless behavior underneath. Each product supplies a complete light and dark primary family and a complete light and dark secondary family. Shared UI stops at reusable interface; product screens stay in the product repositories. Old imports, token aliases, and source sync are gone, and consumers use the public packages directly. The packages stay private until a later release task.

## Operating Context

Engineers work in the product repositories and consult this Storybook while implementing a screen. `pnpm storybook` builds the packages and serves the catalog at http://localhost:6006.

They consume built public entries, not library source:

- `@molcrafts/design` and `@molcrafts/design/styles.css` for React 19
- `@molcrafts/design-tokens/runtime.css` for framework-free CSS, or `@molcrafts/design-tokens/tailwind.css` when the app authors Tailwind v4 utilities
- `@molcrafts/design-web-components` for a separate custom-element runtime
- `@molcrafts/design-vega` and `@molcrafts/design-vega-lite` only when a product needs charts

React themes and overlays use `ThemeScope`. Explicit light and dark modes use `data-mol-theme`. Products keep their own mode switch and provide both modes of both brand families. Neutral actions and status colors stay shared. Scientific chart colors stay with the product. Registry entries are setup and composition examples of the same packages.

Maintainer documentation in `docs/` is written in Chinese. Package names, APIs, and Storybook identifiers are English.

Paths below are from the repository root.

## Capabilities and Constraints

Confirmed:

- Workspace packages are `@molcrafts/design`, `@molcrafts/design-tokens`, and `@molcrafts/design-web-components`, plus optional `@molcrafts/design-vega` and `@molcrafts/design-vega-lite`. The project name is `molcrafts-design`. MIT is approved. The packages are private and unpublished. The external repository rename is deferred. Publishing, tagging, and external renaming wait for a later release task.
- Consumers move directly to the public imports and the compiled CSS.
- Tokens do not depend on React, primitives, or applications. Packages do not import apps. Applications do not scan library source.
- Web Components share tokens through an independent runtime. They keep their own native APIs. Thirteen official elements are managed today, and elements are not registered during SSR.
- Chart packages are optional and sit outside core UI and tokens. Vega-Lite compiles into the Vega viewer.
- Storybook consumes the built public packages. The workspace uses Node 24+ and pnpm 11.25.0.
- Component API ownership, full story and state coverage, and at least one real product integration are still open on the roadmap.

Undecided:

- npm publish permission, public hosting, and the external repository URL.
- Which product migrates first.
- A named WCAG conformance level.

## Brand Commitments

The product name is MolCrafts Design. The project name is `molcrafts-design`. The binding visual baseline is the current Fluent 2 Web contract, including official Fluent icons. Each product owns its primary and secondary brand colors.

## Evidence on Hand

- Design constitution: `docs/design-constitution.md`
- Token catalog: `docs/token-catalog.md`
- Theming: `docs/theming.md`
- Component catalog: `docs/component-catalog.md`
- Readiness and roadmap: `docs/design-system-readiness.md`, `docs/design-system-roadmap.md`
- Storybook stories under `apps/storybook/src/`
- Consumer fixture and screenshots under `tests/consumer/`

No testimonials, customer names beyond molexp, molvis, and molhub, benchmarks, pricing, or press are on file. Future work must not fabricate them, or claim that a real MolCrafts product has already migrated.

## Product Principles

1. Own the contract. APIs, tokens, themes, and package boundaries belong to MolCrafts. Headless behavior can come from a mature library.
2. Products bring the brand. Each product supplies complete light and dark primary and secondary families. Shared UI does not invent product screens or product data colors.
3. One implementation. Storybook, registry examples, and products consume the public packages. There is one source, and consumers meet it at the public entry.
4. The catalog shows the public surface. A product engineer should be able to check a component, token, or theme in Storybook and then import that same public entry.
5. Unfinished work stays labeled. Private packages and unverified product migration remain facts until a later release or product migration task changes them.

## Accessibility & Inclusion

Body text contrast is at least 4.5:1. Large text is at least 3:1. Identifiable control boundaries and focus indicators are at least 3:1. Every action is available from the keyboard, and focus returns to the trigger. Icon-only controls need an accessible name and a visible tooltip; the tooltip is not the accessible name. Forced-colors and reduced-motion preferences are part of the contract. Status is never conveyed by color alone. A named WCAG conformance level is undecided.
