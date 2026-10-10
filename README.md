# @molcrafts/ui — shared shadcn registry for MolCrafts

**Source of truth** for the MolCrafts visual constitution and shadcn-style React
primitives shared by **molexp**, **molvis**, and **molhub**.

This is **not** only an opaque npm component library. Following
[shadcn registry](https://ui.shadcn.com/docs/registry):

1. Author components here as source.
2. `npm run build:registry` → static JSON under `public/r/`.
3. Product apps install with:

```bash
npx shadcn@latest add @molcrafts/button
```

Optional npm package may later ship **tokens + `cn` + thin re-exports** for
plugin runtimes; product apps should prefer the registry so they keep local
ownership of UI source after install.

## What’s in the registry (35 items)

| Kind | Items |
|------|--------|
| Foundation | `utils`, `tokens` |
| Primitives | button, badge, input, label, tabs, tooltip, dialog, dropdown-menu, select, checkbox, separator, scroll-area, popover, slider, card, table, sheet, skeleton, textarea, alert-dialog, accordion, collapsible, context-menu, switch, empty-state, code, number-field, progress-spinner, resizable, command |
| Blocks | `settings-section`, `settings-shell`, `edge-panel` (pull-from-edge rail; includes `use-pointer-drag`) |

### CSS: extract constitution, not brand

`tokens` ships the shared **constitution** (type scale, radius, control geometry,
motion, status roles, semantic slots). Product brand palettes (`--molexp-*`,
`--molvis-*`) stay in product repos and rebind `--accent` / surfaces.

### Plugin UI: no Cell type

`molvis/plugin/src/ui` is only **button / checkbox / select**. Those three are
in this registry. There is no separate “plugin cell” primitive; table cells
live under `table`. Plugin package API stays for runtime; sources converge here.

See [docs/extraction-matrix.md](docs/extraction-matrix.md) for the full matrix.

## Spec

- Design: [`.claude/specs/molcrafts-ui-registry-01.md`](.claude/specs/molcrafts-ui-registry-01.md)
- Acceptance: [`.claude/specs/molcrafts-ui-registry-01.acceptance.md`](.claude/specs/molcrafts-ui-registry-01.acceptance.md)
- Extraction matrix: [docs/extraction-matrix.md](docs/extraction-matrix.md)

## Quick start (registry authors)

```bash
cd ~/work/molcrafts/molcrafts-ui
npm install
npm run build:registry   # writes public/r/*.json
npm run dev:registry     # optional static server for /r
```

## Storybook (component authors)

Requires Node.js 20.19+ or 22.12+ and npm. Storybook 10 uses
[Rsbuild](https://storybook.rsbuild.rs/guide/framework/react), powered by Rspack.

```bash
npm ci
npm run storybook        # http://localhost:6006
npm run build:storybook  # static site in storybook-static/
npm run typecheck        # includes stories and Storybook configuration
```

The preview imports Tailwind v4 and the shared `src/styles/tokens.css` scaffold.
Use the theme toolbar to switch between light and dark; the theme is applied to
the preview document so dialogs and other portaled overlays inherit it too.
The Docs tab shows generated component documentation and controls, and the
Accessibility panel checks the rendered story.

Stories live next to components as `*.stories.tsx`. Initial examples cover
buttons, badges, form controls, dialogs, tabs, empty states, numeric fields,
cards/loading states, resizable panels, and settings sections. The button,
dialog, and numeric-field stories also exercise interaction behavior through
`play` functions. Add new stories using typed `Meta` and `StoryObj` imports from
`storybook-react-rsbuild`. Stories and preview styles are development-only and
are not included in the generated registry or product sync.

## Product consumers

In each app’s `components.json`:

```json
{
  "registries": {
    "molcrafts": {
      "url": "https://ui.molcrafts.dev/r/{name}.json"
    }
  }
}
```

Until hosted, use a local path or GitHub raw URL during bootstrap.

## Status

**Registry + product rewire complete** for **molexp**, **molvis** (page + plugin),
and **molhub** web (local `file:` registry, `sync:products`, constitution CSS).

```bash
npm run build:registry
npm run sync:products   # push sources into sibling molexp / molvis / molhub trees
```
