# Baseline audit and current implementation status

Date: 2026-10-10. The baseline is `7c4d9be`; current completion scope is in [roadmap](design-system-roadmap.md).
The user later explicitly required no backward compatibility; this file no longer treats retaining old APIs as an implementation constraint.

## Baseline and current boundaries

| Area | Audited baseline | Current implementation / remaining work |
| --- | --- | --- |
| Workspace | npm workspaces, native package only | pnpm 11.25.0, 6 workspace projects, a single lockfile, dependencies declared per package |
| React | 30 primitives and 3 blocks under root src, distributed as source | The single implementation moved to packages/ui; Rslib ESM, types, compiled CSS, and public exports; refining public contracts is still done batch by batch |
| Tokens | 5 CSS files at the root, Fluent 2 generated mappings | packages/tokens, an independent pure-CSS runtime and a Tailwind entry; a generated inventory of 127 tokens, types/metadata, nested themes, and overlay inheritance are implemented |
| Storybook | Root .storybook, 13 story files | The sidebar covers every React component, ThemeScope, two chart views, and 13 Web Components; `pnpm verify:stories` fails when an entry is missing. Impeccable reviews one target at a time. Full state coverage is still completed batch by batch |
| Registry | 35 core-source items | Old items deleted; only setup and button-example remain; they reference canonical packages |
| Web Components | 13 tags, independent build, types, and browser tests | Keep the independent runtime; shared CSS is generated from tokens, and a tokens copy is no longer committed |
| Consumer | No independent React artifact-consumption verification | An Rsbuild fixture with no Tailwind config; a local tarball is installed/built in an external temporary directory |
| Quality | Types, generation consistency, native browser, Storybook build | CI added for exports/CSS/SSR, consumer behavior, and all existing stories; theme-page/overlay axe, keyboard, forced-colors/reduced-motion, and 3 visual baselines added; whole-library coverage is still completed batch by batch |
| Products | Historical extraction matrix and source-sync paths | Sync scripts deleted; real products were not modified or re-verified, and product migration PRs are required |
| Release | private, no release process | The three packages use the confirmed design-series names; MIT, Changesets, and tarball/version rehearsal are configured; still private, with no publish, external rename, or automatic publishing |

React source, purpose, exports, and story links are in the [generated component catalog](component-catalog.md).
A sidebar entry proves the component is wired into Storybook. It does not prove that every public API and state is covered, and it does not widen Impeccable's single-target review scope.
The native inventory/API is not required to be feature-equivalent to React; see [native package docs](../packages/web-components/README.md).

## Handled risks and remaining items

| Risk | Result / follow-up |
| --- | --- |
| Rslib non-bundle mode flattens directories or the JSX runtime is missing | Explicit outBase and the React plugin; module-closure and SSR checks cover it |
| CSS exists only in the Storybook compilation | UI emits complete CSS; standalone consumers do not configure Tailwind and do not scan source |
| Token references to upstream create an implicit design dependency | Pin the input version and keep owned mappings; reference.json pins the input; generate metadata/inventory; upgrades must review owned mappings and screenshots |
| Registry/npm have two component implementations | Delete core-source distribution and the old sync; the Registry only provides package configuration/composition |
| utils depend on product-private scales | Delete product-specific extensions; products migrate themselves, with no compatibility shim |
| Scoped themes are lost in portals | ThemeScope provides a nearest host for 8 kinds of React overlays; nested mode/brand hot switching is verified; watch ancestor transform/overflow limits |
| Native CSS copies drift | The shared runtime is built from tokens into standalone theme.css; reset/shadow/form tests remain |
| Real-product migration fails | This repository's fixture cannot prove real-product integration; product PRs and tests are still unfinished |
| A rename misses an entry point or publishing happens early | Final package-name/URL/version/license review is a later stage; do not publish or rename now |

## Preparation for the next stage

- [x] Complete foundation/semantic token contract and theme/portal verification.
- [ ] First-batch component props, variants, sizes, states, refs, and extension contracts.
- [ ] Molvis intake in the roadmap: callout, vertical field, color field, shortcut chip, radio group, icon action, inspector section, and a Tabs icon-strip variant. Slider and NumberField gain drag preview and commit-on-release. Product-only surfaces listed there stay in molvis.
- [ ] Stories/state coverage, a11y, and key visual regression for every public component.
- [ ] New-entry integration and functional verification for at least one real product.
- [x] Confirm npm names/subpaths, MIT/third-party attribution, the alpha version plan, and a local release rehearsal.
- [ ] Actual npm permissions, external repository URL renames, and a formal candidate release.

For the new entry points see [migration notes](workspace-migration.md); old source, old CSS aliases, and a sync compatibility layer are not provided.
