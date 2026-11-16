# @molcrafts/ui

Canonical React implementation for molcrafts-ui, built with Rslib.
Confirmed name; MIT licensed, published on npm `alpha`.

```tsx
import { Button, Dialog, DialogContent, DialogTitle } from "@molcrafts/ui";
import "@molcrafts/ui/styles.css";
```

React 19 is a peer dependency. `styles.css` includes semantic tokens, component
utilities and Tailwind v4 preflight; import it once before application overrides.
Consumers need no Tailwind plugin, library scanning or source alias. The stylesheet
includes default light tokens. `ThemeScope` selects explicit light/dark modes, accepts
complete product brand families and keeps descendant overlays in the same theme.
Nested explicit modes reset defaults; pass the appropriate brand to retain it.
See [theming](https://github.com/MolCrafts/molcrafts-ui/blob/master/docs/theming.md) for APIs, inheritance and portal placement limits.

The root entry exports all existing primitive and block APIs. `@molcrafts/ui/utils`
exports `cn`. Implementation modules are internal; Registry contains package setup and composition examples only. Old source-sync
paths, deprecated color aliases and product-specific merge extensions are removed.
Consumers migrate directly to the new package entries; there are no compatibility shims.

From repository root: `pnpm build:ui`, `pnpm typecheck`, `pnpm build:consumer`.
Each component has a Storybook story. See `docs/component-catalog.md`.

MIT licensed. See LICENSE, NOTICE.md and THIRD_PARTY_NOTICES.md included in this archive.
Release preparation: https://github.com/MolCrafts/molcrafts-ui/blob/master/docs/releasing.md
