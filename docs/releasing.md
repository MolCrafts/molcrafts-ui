# MolCrafts Design: pre-publish preparation and the release process

2026-10-11 · Current status: first release `0.1.0-alpha.0` on the npm `alpha` dist-tag, published on the owner's explicit request.
The user has chosen the `@molcrafts/design` package-name family and MIT. The GitHub repository is still
[MolCrafts/molcrafts-ui](https://github.com/MolCrafts/molcrafts-ui). Renaming it externally is handled separately.
The machine-readable plan is [release/plan.json](../release/plan.json).

## Packages and the release boundary

| Package | Content | Public entries |
| --- | --- | --- |
| `@molcrafts/design-tokens` | Framework-agnostic tokens, types, and metadata | root, runtime.css, tailwind.css, contract.json |
| `@molcrafts/design` | React 19 components and compiled CSS | root, utils, styles.css |
| `@molcrafts/design-web-components` | Independent native components, registration, CSS, a manifest, and a browser bundle | root, register, theme.css, custom-elements.json, browser.js |
| `@molcrafts/design-vega` | Optional Vega runtime and React viewer | root (VegaView, createChartConfig, useChartTheme, and public types) |
| `@molcrafts/design-vega-lite` | Optional Vega-Lite compiler that reuses the same viewer | root (VegaLiteView, compileVegaLite, and public types) |

The root, Storybook, and consumer fixtures are not published. The five distributable packages temporarily share one version so the shared theme
contract can be adopted as one versioned set. A Changesets fixed group manages that rule, and apps are excluded.
The packages are ESM. React is a peer dependency. Consumers do not need to build the library's Tailwind sources.
The native entry loads in the browser. It does not promise direct Node or SSR execution, or React API parity.

The workspace is in Changesets pre mode (`alpha`). The first release is `0.1.0-alpha.0` on the npm `alpha` channel,
not stable or latest. This rehearsal did not change the actual version and did not enter workspace prerelease mode.
Alpha means the API and styles are still being completed batch by batch. Passing the pack step does not finish P3/P4 or real-product verification.

## The current repeatable rehearsal

Use Node 24+, pnpm 11.25.0, and a frozen lockfile:

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm release:status
pnpm prepare:release
pnpm build:consumer
pnpm exec playwright install chromium
pnpm test:consumer
pnpm test:web-components
pnpm build:storybook
pnpm test:storybook
```

`prepare:release` builds the five packages and verifies exports, CSS, and SSR, then runs the following steps:

1. In a temporary workspace, call the official Changesets CLI and rehearse `pre enter alpha` and `version`.
   Check the five alpha versions and the generated changelogs, and confirm that apps are not version-bumped. Do not modify the current versions, and do not create tags.
2. Use `pnpm pack` to produce five real tarballs. Unpack them and check files and exports, the license, source metadata,
   and dependency rewriting, and record the SHA-256 hashes and file manifests.
3. In a temporary directory outside the repository, install the five tarballs and, using their public types and CSS, run TypeScript
   plus both the React and native Rsbuild entry builds. There is no access to library source and no Tailwind configuration.

`release-artifacts/` is gitignored. It contains `report.json`, `version-plan.json`, the five tarballs,
and a `changelogs/` preview. **The current tarballs are still 0.0.1 rehearsal artifacts and must not be treated as alpha release candidates.**
The report records the commit and whether the workspace is dirty. CI uploads the rehearsal artifacts for that commit and does not publish.
A standalone consumer needs network access to npm in order to read existing external dependencies, but it does not write to the npm registry and does not read publish credentials.

## Changes and version records

When a shared API, a token or style contract, or a distributed file changes, run `pnpm changeset` and describe the concrete behavior
and the effect on consumers. Changes that do not affect the distribution contract, such as documentation and developer tooling, do not have to produce a package version.
`pnpm release:status` does a read-only check against the commit history of `origin/main`. A shallow clone should fetch the rest of the history first.
CI uses a full fetch. `pnpm release:version` rewrites the manifests and each package CHANGELOG.
Use it only on an actual release branch. Do not run it for this preparation.

Stable versions follow semver: a breaking public API or style-contract change is a major bump, a new capability is a minor bump, and a fix is a patch.
During 0.x, a breaking change at least raises the minor version and records a direct migration method. Every alpha release must also
record what changed. There is no compatibility shim for an old package name, an old token, or source sync, and the same implementation is not published again under an old package name.
The initial changeset describes the foundation that is already done. It does not claim that every component contract or product integration has been accepted.

## Licensing and third-party sources

The root and the five packages carry an MIT LICENSE. The MolCrafts license does not cover third-party copyrights.
The React NOTICE keeps the shadcn/ui derivative origin and the Microsoft Fluent attribution. The tokens NOTICE
keeps the official token sources. The native NOTICE and THIRD_PARTY_NOTICES contain the license text for the official tokens and icons,
Fluent and FAST, and a conservative dependency closure, including the Apache-2.0 and 0BSD terms.
`pnpm build:notices` generates the full text from the installed pinned dependencies. A missing license for an unknown source fails the generation.
The React package's npm runtime dependencies are not bundled. They still carry their own upstream licenses.
Segoe font files are not distributed. The font stack uses only fonts already installed on the system. Official font and asset terms still apply.

## Release conditions that are not yet met

- Review of the API, states, stories, and upgrade notes for the public components chosen for the first release is complete, and the remaining scope is explicitly marked.
- At least one real MolCrafts product uses the new imports and CSS, and there is evidence of functional verification.
- In an explicit release task, check npm scope ownership, the five names, and the publish account's permissions. Choosing the package names is not the same as holding those permissions.
- Confirm when the external GitHub rename happens, and align repository, homepage, and bugs, the Registry URL, the docs, and the product links.
- Review the real alpha manifests and changelogs, and the candidate tarballs built from a clean commit. Confirm what is published, the channel, and the source.

These are unfinished items on the [roadmap](design-system-roadmap.md). This rehearsal does not skip them automatically.

## The later, actual release task

The steps below describe a future process. They are not actions authorized by this rehearsal:

1. From a fully green main, create a release branch and confirm the first-release scope and channel. Use Changesets `pre enter alpha`
   and `release:version` to generate the real versions and changelogs, and update the lockfile.
2. Set `private` to false only for the five distributable packages. Keep the root and the apps private. During preparation,
   `prepare:release` rejects packages that are not private. On the release PR, turn that check into an explicit candidate
   check instead of skipping export, license, dependency, or consumer verification.
3. Finish the candidate build, public types, accessibility and visual checks, native checks, tarball checks, and real-product checks. Review the release PR and merge it.
4. The release operator confirms the exact commit, the versions, and the alpha tag. Publish tokens first, then the React package and the native package.
   After publishing, install the actual versions from the registry again and verify them. Do not substitute the local workspace.
5. After verification, record the release tag or GitHub release, the changelog, and the package links. npm Trusted Publishing can be configured separately later.
   There is currently no publish command, no publish workflow, no token secret, and no automatic tag or release.

A published version cannot be overwritten and published again. On failure, record which packages and versions succeeded, then finish the remaining packages or publish a fix version.
Do not modify an existing tarball. Products roll back to the previous explicit version set. If there is a serious problem, the release operator reviews
changing the dist-tag or deprecating the release. The first release has no previous stable set, and it does not promise an automatic rollback to the old source.

Optional chart packages are included in release/plan.json and the fixed Changesets group.
Core remains engine-free; native Vega consumers do not install the Lite compiler.
See [plotting architecture](chart-architecture.md).

## The first release, as run

- Release PR: `changeset pre enter alpha`, `changeset version`, `private` removed from the five packages.
  `prepare:release` now audits release candidates: packages publishable, at the planned version, with changelogs.
- npm cannot configure trusted publishing for a package that does not exist yet, so the owner logged in and
  `0.1.0-alpha.0` was published once by hand from the merged release commit, in dependency order, from the
  audited `release-artifacts/` tarballs, then reinstalled from the registry and verified.
- Later releases: add the trusted publisher (MolCrafts/molcrafts-ui, `release.yml`, environment `npm`) on each
  package's npm settings, then push a `v<version>` tag on main. `release.yml` guards the tag, rebuilds and audits
  the archives, publishes any version not yet on npm with provenance, and records the GitHub Release.
