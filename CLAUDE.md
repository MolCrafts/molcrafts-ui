---
mol_project:
  name: molcrafts-ui
  language: typescript
  stage: experimental
  specs_path: .claude/specs/
  notes_path: .claude/notes/
  build:
    install: "npm ci"
    check: "npm run typecheck"
    test: "npm run build:registry"
  doc:
    style: google
---

# molcrafts-ui / future molcrafts-design

Read [AGENTS.md](AGENTS.md) for current architecture and development rules.

- Current spec: [design-system-refactoring-spec](docs/design-system-refactoring-spec.md).
- Implementation plan: [roadmap](docs/design-system-roadmap.md).
- Current capabilities and gaps: [readiness audit](docs/design-system-readiness.md).
- Visual rules: [design constitution](docs/design-constitution.md).
- Historical Registry spec: `.claude/specs/molcrafts-ui-registry-01.md`.
- Historical extraction matrix: `docs/extraction-matrix.md`.

The target is an independent React design system using pnpm, Rslib and Storybook
Rsbuild, with versioned packages as future primary distribution. Current npm/source
workflows remain in place until migration. Preparation does not authorize publishing
or external renaming; future project name is `molcrafts-design`.
Do not put product-domain UI here or copy changes into sibling products implicitly.
