# Version records

Run `pnpm changeset` when a public API, token or styling contract changes.
The three distributable packages use fixed versions. Private packages participate
in local version planning but create no tags. Apps and the root remain private.

`pnpm release:status` is read-only. `pnpm release:version` updates manifests and
package changelogs locally; run it only on a release branch after the release plan
is reviewed. No publish script or automatic release workflow is configured.
See [release preparation](../docs/releasing.md).
