# molcrafts-design naming and entry migration

2026-10-10: The user confirmed the three npm package names and MIT. In-repository names, public imports, dependencies, Storybook,
the Registry, the consumer fixture, and the portable Skill are now consistent. The external GitHub repository has not been renamed.

| Previous internal name | Canonical name | Source directory |
| --- | --- | --- |
| @molcrafts/tokens | @molcrafts/design-tokens | packages/tokens |
| @molcrafts/ui | @molcrafts/design | packages/ui |
| @molcrafts/web-components | @molcrafts/design-web-components | packages/web-components |
| skills/molcrafts-ui | skills/molcrafts-design | skills/molcrafts-design |

Directory names express the layers. They do not need to copy or move source just because the npm name changes. There are no old package exports, npm aliases,
or compatibility shims. Products change imports and CSS entries directly. The following names have not been published:

```tsx
import { Button, ThemeScope } from "@molcrafts/design";
import type { ProductTheme } from "@molcrafts/design-tokens";
import "@molcrafts/design/styles.css";
```

```ts
import { registerMolcraftsComponents } from "@molcrafts/design-web-components";
import "@molcrafts/design-web-components/theme.css";
```

Pure CSS uses `@molcrafts/design-tokens/runtime.css`. Registry setup and examples refer to the same packages.
They are not the old core source items. Ordinary applications currently connect through the workspace or a local tarball.

## What to update together when the external repository is renamed

The target GitHub repository is `MolCrafts/molcrafts-design`. This external rename was not performed.
When preparing the actual rename PR, check the following places:

- The repository URL and directory, homepage, and bugs fields in the three manifests.
- The homepage in registry.json and the real Registry hosting URL. Do not assume that new hosting already exists.
- GitHub links in the README, the Skill, and the release docs, and remote docs links in the package READMEs.
- Git remotes, the CI environment and permissions, npm provenance and trusted-publisher bindings, and product dependency records.
- In each real product, installation of the new packages, public imports, stylesheets, and lockfiles. Submit those product PRs separately.

Package directories, CSS runtime token names, native Fluent tag names, and the registerMolcraftsComponents function are not renamed
just because the project name changes. Historical .claude specs and the extraction matrix keep their historical names. They must not be treated as
current guidance. A GitHub redirect does not replace a product API migration or npm publish identity checks.

The release steps and the remaining conditions are in [releasing](releasing.md). The packages are still private and unpublished.

Optional chart packages: `@molcrafts/design-vega` (packages/vega) and
`@molcrafts/design-vega-lite` (packages/vega-lite). There is no old ui-vega name and no compatibility alias.
