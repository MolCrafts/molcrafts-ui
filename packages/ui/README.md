# @molcrafts/ui (temporary private workspace name)

Canonical React implementation, built with Rslib. Project rename to
`molcrafts-design` and final package names are deferred; no publishing.

```tsx
import { Button, Dialog, DialogContent, DialogTitle } from "@molcrafts/ui";
import "@molcrafts/ui/styles.css";
```

React 19 is a peer dependency. `styles.css` includes semantic tokens, component
utilities and Tailwind v4 preflight; import it once before application overrides.
Consumers need no Tailwind plugin, library scanning or source alias. The stylesheet
includes the default light theme; `.dark` selects dark and `.mol-product-theme`
scopes product palettes. See the design constitution for complete brand contracts.

The root entry exports all existing primitive and block APIs. `@molcrafts/ui/utils`
exports `cn`. Implementation modules are internal; Registry contains package setup and composition examples only. Old source-sync
paths, deprecated color aliases and product-specific merge extensions are removed.
Consumers migrate directly to the new package entries; there are no compatibility shims.

From repository root: `pnpm build:ui`, `pnpm typecheck`, `pnpm build:consumer`.
Storybook consumes the same built public APIs. See `docs/component-catalog.md`.
