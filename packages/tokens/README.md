# @molcrafts/tokens (temporary private workspace name)

Framework-independent CSS tokens owned by MolCrafts, with a pinned Fluent 2
reference input. No React, headless primitive or application runtime dependencies.
No package publishing; final names follow the future `molcrafts-design` rename.

```css
/* Plain CSS; standalone, flattened, no build plugin required. */
@import "@molcrafts/tokens/runtime.css";

/* Optional Tailwind v4 integration, for applications authoring own utilities. */
/* @import "tailwindcss"; @import "@molcrafts/tokens/tailwind.css"; */
```

`runtime.css` supplies light/dark semantic colors, geometry, typography, motion,
focus and state behavior. `data-mol-theme="light|dark"` selects explicit scoped modes;
`.dark` also selects dark. No rebuild is required.
`tailwind.css` maps the same design into Tailwind utilities and resolves its
adjacent CSS assets. The root entry exports framework-independent `tokenContract`
metadata and TypeScript theme contracts; `contract.json` exposes the generated list.
Individual CSS entries and deprecated brand aliases are not supported.
See [theming](../../docs/theming.md) and [127-token catalog](../../docs/token-catalog.md)
for semantic roles, full primary/secondary families and reference upgrade review.

Root `pnpm build:tokens` regenerates owned mappings and builds assets. Do not edit
generated Fluent mappings by hand. React compiled CSS already includes tokens;
loading the runtime entry separately is optional for a React-only consumer.
