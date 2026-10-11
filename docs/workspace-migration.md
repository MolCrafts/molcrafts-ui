# Workspace and consumer-entry migration

2026-10-10: the user explicitly required no backward compatibility. The future project name is `molcrafts-design`.
The three packages already use the user-confirmed @molcrafts/design series names and MIT, and all are private;
nothing has been published and no external resource has been renamed. See [naming migration](rename-plan.md).

## New entry points

```tsx
import { Button, Input, Dialog, DialogContent, DialogTitle } from "@molcrafts/design";
import "@molcrafts/design/styles.css";
```

All components are imported from the root public entry, and `cn` can also be imported from `@molcrafts/design/utils`.
Do not reference implementation internals under packages, and do not copy component source into products again.
CSS includes the default tokens, every component utility, and preflight, and does not require the product to install Tailwind
or scan library source. A Tailwind application that needs its own utilities may additionally import the tokens
`tailwind.css`; pure CSS uses `runtime.css`. The application itself controls page layout and the product theme.

## Deleted old contracts

| Old | New |
| --- | --- |
| Root `src/components`, `src/hooks`, `src/lib` | The single implementation is in packages/ui; consumers use public exports |
| Root `src/styles` and the standalone constitution CSS import | tokens/runtime.css or UI/styles.css |
| `--accent-*`, `--link-*` | `--primary-*`, `--primary-link` / `--primary-link-hover` |
| MolCrafts aliases for `rounded-sm/md/lg/xl` | Use roles such as control/panel/overlay/checkbox; Tailwind stock values are still defined by Tailwind |
| Product-private size/font/container scales in utils | Products configure them themselves; shared cn only recognizes MolCrafts-owned scales |
| 35 core-source Registry items | setup and button-example reference canonical packages |
| sync:products / source-copy scripts | Product repositories adopt the packages through separate PRs |
| npm lockfile / root Storybook config | pnpm workspace lockfile / apps/storybook |

There is no old-entry re-export, alias adapter, or dual component implementation. Radix behavior that works is kept;
there is no need to rewrite all behavior just to delete the compatibility layer. Component appearance in this change still follows the existing Fluent 2 baseline.

## Verification and current limits

- Rslib emits a complete ESM module tree and declarations; package exports do not depend on source aliases.
- The standalone Rsbuild fixture has no Tailwind/source alias; the browser verifies size, theme, interaction, and portals.
- The local tarball is installed and built in a temporary external directory and does not depend on workspace links.
- The native package's standalone theme.css is built from the same tokens, and source no longer stores a shared tokens copy.
- Storybook uses the built public API; all existing stories run, and full API/state coverage is still to be filled in.
- molexp/molvis/molhub were not modified; real-product functional acceptance still awaits the corresponding product PRs.

Theme ownership, API contracts, a11y/visual coverage, and the future rename/release are carried out in batches according to the roadmap.
