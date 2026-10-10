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
focus and state behavior. `.dark` switches theme without rebuilding.
`tailwind.css` maps the same design into Tailwind utilities and resolves its
adjacent CSS assets. Only runtime and Tailwind integration entries are public; old individual CSS
entry points and deprecated brand aliases are not supported. Components use semantic slots; product
primary/secondary overrides follow `docs/design-constitution.md`.

Root `pnpm build:tokens` regenerates owned mappings and builds assets. Do not edit
generated Fluent mappings by hand. React compiled CSS already includes tokens;
loading the runtime entry separately is optional for a React-only consumer.
