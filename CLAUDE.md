---
mol_project:
  name: molcrafts-design
  language: typescript
  stage: experimental
  specs_path: .claude/specs/
  notes_path: .claude/notes/
  build:
    install: "pnpm install --frozen-lockfile"
    check: "pnpm typecheck"
    test: "pnpm build:registry"
  doc:
    style: google
---

# molcrafts-design

Read [AGENTS.md](AGENTS.md) for current architecture and development rules.

- Current spec: [design-system-refactoring-spec](docs/design-system-refactoring-spec.md).
- Implementation plan: [roadmap](docs/design-system-roadmap.md).
- Current capabilities and gaps: [readiness audit](docs/design-system-readiness.md).
- Visual rules: [design constitution](docs/design-constitution.md).
- Historical Registry spec: `.claude/specs/molcrafts-ui-registry-01.md`.
- Historical extraction matrix: `docs/extraction-matrix.md`.

The target is an independent React design system using pnpm, Rslib and Storybook
Rsbuild, with versioned packages as future primary distribution. Workspace and public-package
boundaries are implemented; remaining ownership/quality work follows the roadmap.
No backward compatibility is required. Implementation does not authorize publishing
or external renaming. Confirmed package names use `@molcrafts/design`; MIT and
local release preparation are approved. See [releasing](docs/releasing.md).
Do not put product-domain UI here or copy changes into sibling products implicitly.
