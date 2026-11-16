---
slug: molcrafts-ui-registry-01
title: MolCrafts shared shadcn registry (molcrafts-ui)
status: approved
created: 2026-08-10
product: molcrafts-ui
language: en
---

> Historical Registry document. The registry-first distribution direction is superseded by
> [Refactoring Spec v1.0](../../docs/design-system-refactoring-spec.md). The owner subsequently required no backward compatibility; old source workflows
> are removed. This document does not establish completion of the new refactor.

# molcrafts-ui-registry-01 — Cross-product shadcn Registry

## Summary

Build a **MolCrafts shared UI source repository and shadcn Registry** at `~/work/molcrafts/molcrafts-ui`, so that **molexp / molvis / molhub** maintain tokens and primitives the same way: source is maintained in this repository, `shadcn build` produces `/r/{name}.json`, and each product installs it locally with `npx shadcn add @molcrafts/<name>` (the product still owns the copied source).

This spec covers the repository skeleton, the registry contract, the **extraction assessment (see docs/extraction-matrix.md)**, the v0 component list, and the product integration steps. It does not include a big-bang refactor that finishes migrating all three products.

## Domain basis

- Official shadcn model: the CLI copies source. It is not a sole black-box npm dependency. The official way to share across repositories is a **Custom Registry** ([Introduction](https://ui.shadcn.com/docs/registry), [Getting Started](https://ui.shadcn.com/docs/registry/getting-started), [Namespaces](https://ui.shadcn.com/docs/registry/namespace)).
- MolCrafts today: each of the three products forks `components/ui/*`. molvis also has an `@molcrafts/molvis/plugin/ui` npm surface (the plugin runtime boundary). Button class names are already highly isomorphic (`rounded-control` / accent tokens), so button is a suitable canary.
- Extra constraints for scientific-product UI: status colors, control height, and information density (see the `tailwind` token conventions in molexp and molvis) must live in **shared tokens**. Otherwise sharing primitives has no effect.

## Design

### 1. Repository responsibilities

| Path | Responsibility |
|------|------|
| `registry.json` | Registry catalog (name / homepage / items) |
| `src/components/ui/*` | Canonical primitive source |
| `src/components/blocks/*` | Cross-product blocks (SettingsShell and others, v1) |
| `src/lib/utils.ts` | `cn()` |
| `src/styles/tokens.css` | CSS variables / control-size tokens |
| `public/r/` | `shadcn build` output (a static site that can be deployed) |
| `docs/extraction-matrix.md` | Extraction assessment (living doc) |
| `.claude/specs/*` | This design and its acceptance criteria |

Optional follow-up: publish `packages/ui` to npm as **tokens + cn** for the plugin runtime. **Do not use npm as the primary distribution path for product apps.**

### 2. Distribution and consumption

```
molcrafts-ui (source)
    shadcn build → public/r/*.json
         │
         ├─ molexp/ui   components.json registries.molcrafts
         ├─ molvis/page components.json registries.molcrafts
         └─ molhub/web  components.json registries.molcrafts
```

Each product:

```json
"registries": {
  "molcrafts": { "url": "https://ui.molcrafts.dev/r/{name}.json" }
}
```

During development, `file:` / `localhost` / GitHub raw may be used.

### 3. Extraction principles (Reuse decision)

For each candidate in the inventory:

| Decision | Condition |
|------|------|
| **extract** | Used by 2 or more products, or clearly going to become part of the design system; no domain API |
| **later** | Useful, but dependencies are heavy or variants have not converged |
| **stay** | Bound to a single product's domain, routing, OpenAPI, or specific to an agent or viewer |

**Reuse conclusions (summary)** — the full table is in `docs/extraction-matrix.md`:

- **v0 extract:** cn + tokens + button, badge, input, label, tabs, tooltip, dialog, dropdown-menu, select, checkbox, separator, scroll-area, popover, slider
- **v1:** card, table, sheet, skeleton, textarea, alert-dialog, accordion, collapsible, context-menu, switch, empty-state, code, **SettingsShell/Section/Row**
- **v2:** converge WorkbenchAction and ViewerAction, toast, command
- **stay:** tree, markdown, thinking-block, tool-call-row, the confirm-dialog bus, Entity/Dashboard, Molq\*, Viewer\* toolbars, StatusStrip (leave it in molexp first)

### 4. Relationship to molvis-plugin

- **Short term:** the plugin keeps exporting `@molcrafts/molvis/plugin/ui` (bundled externals stay the same).
- **Medium term:** button, select, and checkbox inside the plugin **switch to the same source as this registry** (by copy or by a build-script sync), so there are not two sources.
- **Forbidden:** putting SettingsShell into molvis-plugin (that pollutes the SDK boundary).

### 5. Token strategy

v0 establishes one shared token file (names aligned with the existing molexp and molvis tokens):

- surfaces: `background`, `foreground`, `card`, `muted`, `accent`, `border`, `ring`
- control: `--radius-control`, `--height-control*` (or a mapping of the existing `h-control`)
- status: `status-running|succeeded|failed|warning` (v0 may use placeholders first; v1 aligns the color values with the three products)

Product CSS `@import`s the registry tokens, then layers product-specific variables on top.

### 6. Versions and changes

- Registry item changes: a pull request in the source repository, plus a build. Consumers run `shadcn add @molcrafts/<name> --overwrite`, or a CI sync job.
- Semver binary compatibility is not guaranteed for copied source. Communicate breaking changes with a **changelog and an item description**.
- A git tag in the source repository may optionally mark a registry release point.

## Files (repository skeleton)

```
molcrafts-ui/
  README.md
  package.json
  components.json                 # this source repository's own shadcn config
  registry.json                   # entry catalog
  src/
    components/ui/                # v0 primitives (filled in gradually)
    components/blocks/            # v1+
    lib/utils.ts
    styles/tokens.css
  public/r/                       # build output (may be gitignored or committed)
  scripts/build-registry.mjs
  docs/extraction-matrix.md
  .claude/specs/
    molcrafts-ui-registry-01.md
    molcrafts-ui-registry-01.acceptance.md
  .gitignore
```

## Tasks

1. **Scaffold** the repository: package.json, components.json, tokens.css, cn, gitignore, and README
2. **Registry catalog:** write `registry.json` (the v0 item list; files may be stubs first, or the button canary may be copied from molexp)
3. **Build pipeline:** `pnpm build:registry` produces `public/r/{name}.json` and the root catalog
4. **Canary extract:** copy `button` and `utils` from molexp, the build succeeds, and a local `shadcn add` dry-run succeeds
5. **v0 batch:** bring the intersection primitives in line with the extraction matrix (the implementation may be split across pull requests)
6. **Consumer wiring doc:** document the `components.json` snippets and migration checklists for molexp, molvis, and molhub
7. **molvis-plugin sync plan:** document how to sync the plugin UI trio from this repository (this spec does not require changing molvis)

## Testing

- `pnpm build:registry` exits 0; `public/r/button.json` exists and matches the key fields of the registry-item schema
- Items in `registry.json` correspond one-to-one with `public/r` (asserted by a script)
- Canary: in a temporary directory, `shadcn add` installs button successfully from `file://` or localhost
- Unit: simple cases for `cn()` (optional)
- Do not require the three products' end-to-end tests to run in this repository

## Out of scope

- Migrating every molexp-only or molvis-only component in one pass
- Forcing each product to delete its local `components/ui`
- Designing a Figma file
- Forcing an npm publish of `@molcrafts/ui` as the primary path
- Code changes in molhub or molvis (a documentation agreement only; the actual wiring is a separate product pull request)
- Local assets such as `ui/.screenshots`

## Open questions (non-blocking)

- Hosting domain: `ui.molcrafts.dev` vs GitHub Pages vs Cloudflare
- Whether `public/r` is committed to git (a small team may commit it; generating it in CI is also fine)
- Schedule for converging the Workbench and Viewer names (v2)
