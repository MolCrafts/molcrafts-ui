# Package names

2026-10-11: The owner chose the `@molcrafts/ui` family right after the first alpha. The package
names now follow the repository (`MolCrafts/molcrafts-ui`) and its source directories, so no repository
rename is planned.

| Directory | npm name | Content |
| --- | --- | --- |
| packages/ui | `@molcrafts/ui` | React 19 components and compiled CSS |
| packages/tokens | `@molcrafts/ui-tokens` | Framework-independent tokens, types and metadata |
| packages/web-components | `@molcrafts/ui-web-components` | Independent managed custom-element runtime |
| packages/vega | `@molcrafts/ui-vega` | Optional native Vega viewer |
| packages/vega-lite | `@molcrafts/ui-vega-lite` | Optional Vega-Lite compiler on the same viewer |

```tsx
import { Button, ThemeScope } from "@molcrafts/ui";
import type { ProductTheme } from "@molcrafts/ui-tokens";
import "@molcrafts/ui/styles.css";
```

```ts
import { registerMolcraftsComponents } from "@molcrafts/ui-web-components";
import "@molcrafts/ui-web-components/theme.css";
```

Pure CSS uses `@molcrafts/ui-tokens/runtime.css`. The skill lives in `skills/molcrafts-ui`.

## Retired names

`@molcrafts/design`, `@molcrafts/design-tokens`, `@molcrafts/design-web-components`,
`@molcrafts/design-vega` and `@molcrafts/design-vega-lite` were published as `0.1.0-alpha.0` on
2026-10-11 and unpublished the same day, inside npm's 72-hour window, before any product depended on
them. The `@molcrafts/ui*` family starts at that same `0.1.0-alpha.0`. Earlier internal names (`@molcrafts/tokens`,
`@molcrafts/web-components`) were never published either. There are no aliases or compatibility shims:
products import the names above directly.

CSS runtime token names, native Fluent tag names and `registerMolcraftsComponents` are unchanged.
Historical `.claude` specs, the extraction matrix and the dated dashboard assessment keep the names of
their time and are not current guidance.
