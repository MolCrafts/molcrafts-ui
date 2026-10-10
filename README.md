# MolCrafts Design — molcrafts-design

Independent shared React UI with Fluent 2 visual language, owned semantic tokens,
Rslib packages and Storybook on Rsbuild/Rspack. **All packages are private and
unpublished.** The package names are confirmed: `@molcrafts/design`,
`@molcrafts/design-tokens`, `@molcrafts/design-web-components`, plus optional
`@molcrafts/design-vega` and `@molcrafts/design-vega-lite`. MIT licensed;
the external repository rename is deferred. See [release preparation](docs/releasing.md)
and [rename plan](docs/rename-plan.md).

Workspace boundaries and runtime theme contracts are implemented, with scoped
React portals, native themes and initial accessibility/visual checks. Component API
ownership, complete story/state coverage and
real-product integration remain tracked in the [roadmap](docs/design-system-roadmap.md).

## Packages and applications

| Path | Responsibility |
| --- | --- |
| `packages/tokens` | Framework-independent runtime CSS and optional Tailwind v4 integration |
| `packages/ui` | Canonical React components, public types and complete compiled CSS |
| `packages/vega` | Optional native Vega View, lifecycle, themes, data/signals and export |
| `packages/vega-lite` | Optional compiler adapter reusing the Vega viewer |
| `packages/web-components` | 13 managed Fluent custom elements with independent native APIs |
| `apps/storybook` | Documentation and playground consuming built public package entries |
| `tests/consumer/app` | Independent Rsbuild application without Tailwind configuration |
| `registry` | Optional package setup and composition examples; no core source distribution |

## Development

Use Node 24+ and pnpm 11.25.0, pinned by `packageManager`.

```sh
pnpm install --frozen-lockfile
pnpm storybook             # build packages, then http://localhost:6006
pnpm typecheck             # builds packages before checking public types and stories
pnpm verify:packages       # exports, module closure, CSS and React SSR
pnpm build:consumer        # independent Rsbuild build, no library source scan
pnpm exec playwright install chromium
pnpm test:consumer
pnpm verify:chart-boundaries # native Vega bundle excludes compiler/editor/embed
pnpm test:web-components
pnpm build:storybook
pnpm test:storybook        # render every story, run plays and verify Autodocs
pnpm verify:consumer-tarball # pack locally, install/build outside this workspace
pnpm build:registry
pnpm build:catalog
pnpm release:status        # pending version/changelog plan, read-only
pnpm prepare:release       # private tarballs + disposable alpha-version rehearsal
```

CI additionally checks generated files and uploads build artifacts. Local packing
is validation, not publishing. No publish/tag/release automation is configured.

## React consumer

These confirmed package names remain private and unpublished:

```tsx
import { Button } from "@molcrafts/design";
import "@molcrafts/design/styles.css";

<Button variant="secondary">Save changes</Button>
```

React 19 is a peer dependency. Component CSS includes tokens, utilities and
Tailwind preflight: import once before application styles. Consumers need no
Tailwind plugin, library source scanning or source alias. For non-React tokens,
import `@molcrafts/design-tokens/runtime.css`; for application-authored Tailwind utilities,
use `@molcrafts/design-tokens/tailwind.css` with Tailwind v4.

Use `ThemeScope` for React themes and scoped overlays; `data-mol-theme="light|dark"`
selects explicit CSS modes, including nested themes. `.dark` also selects dark.
See [theming](docs/theming.md), [token catalog](docs/token-catalog.md) and
[style audit](docs/style-audit.md). Products provide complete primary and secondary
families; neutral actions and status colors remain shared. Toolbar actions prefer
accessible icon-only buttons using official Fluent icons. See the
[constitution](docs/design-constitution.md) and [component catalog](docs/component-catalog.md).

## Migration policy

The owner explicitly requested **no backward compatibility**. Old source paths,
source-sync scripts, core Registry items, `--accent-*` / `--link-*` color aliases,
stock radius aliases and product-specific `cn` scales are removed. Consumers
migrate directly to public imports and the compiled stylesheet; see
[migration guidance](docs/workspace-migration.md). No sibling product is modified
implicitly, and real product migration has not yet been verified.

Web Components share canonical tokens but retain independent native APIs. Their
[package documentation](packages/web-components/README.md) covers registration,
forms, framework integration and client-only loading; React API parity is not claimed.

## Project guidance

- [Spec](docs/design-system-refactoring-spec.md): architecture and acceptance criteria.
- [Roadmap](docs/design-system-roadmap.md): phased changes, reasons and development impact.
- [Readiness audit](docs/design-system-readiness.md): baseline and remaining gaps.
- [Optional charts](docs/chart-architecture.md): Vega Runtime, optional Vega-Lite compiler and consumer boundaries.
- [CI dashboard assessment](docs/dashboard-consumer-assessment.md): first-consumer feasibility, chart integration and CI dependency boundaries.
- [AGENTS.md](AGENTS.md) / [portable Skill](skills/molcrafts-design/SKILL.md).

The older `.claude/specs/molcrafts-ui-registry-01*` documents and
[extraction matrix](docs/extraction-matrix.md) are historical records. Their
registry-first distribution and compatibility policy are superseded.
