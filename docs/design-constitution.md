# MolCrafts UI Constitution · Fluent 2

Version: v1.5, 2026-10-10. Applies to the shared foundational UI of molexp, molvis, and molhub.

## 1. Design baseline and sources

Use **the currently released Fluent UI React v9 / Fluent 2 Web** as the baseline. Versions checked:
`@fluentui/react-components` **9.74.9**; the official
`@fluentui/react-theme` this repository uses to generate CSS is pinned at **9.2.2**. Adopt the color, type, radius, shadow, and motion tokens from its `webLightTheme` and
`webDarkTheme`.

References: [Fluent 2](https://fluent2.microsoft.design/),
[official tokens](https://github.com/microsoft/fluentui/tree/master/packages/tokens),
[typography](https://fluent2.microsoft.design/typography),
[elevation](https://fluent2.microsoft.design/elevation),
[motion](https://fluent2.microsoft.design/motion).

Keep React/Radix primitives that already work. The target is versioned packages as the primary distribution. The Registry
remains an optional integration entry. The old source distribution and sync workflow have been removed, and no compatibility layer is provided. Engineering boundaries follow
[the refactoring spec](design-system-refactoring-spec.md) and [the roadmap](design-system-roadmap.md).
Visual rules for shared UI are defined jointly by this constitution, MolCrafts-owned tokens, and Storybook examples.
Upstream Fluent tokens are reviewed reference inputs. They do not replace MolCrafts ownership of the visual contract.

Principles: reading first, restrained controls, clear hierarchy, and distinguishable states. Carry information with neutral color. Use brand color
for primary actions and selection indicators. Visualization palettes for scientific data are managed separately by the product.

## 2. Type and information density

Prefer Segoe UI, with system-ui and platform-native font fallbacks. Monospace uses
ui-monospace, SFMono-Regular, Menlo, Consolas, and similar platform fonts. Avoid a Courier fallback.
Ordinary text and metrics use the body stack. Use monospace only for identifiers such as code, paths, and commit hashes.
Align digits with tabular-nums. Do not substitute a monospace font for that.
Do not load proprietary fonts from the network. Chinese falls back to system fonts. Clear mixed-script setting and line height must be preserved.

| Role | CSS utility | Size / line height | Use |
|---|---|---|---|
| Secondary metadata | `text-micro` | 10 / 14px | Nonessential supporting metadata |
| Supporting copy | `text-label` | 12 / 16px | Field help, shortcuts, badges |
| Body | `text-body` | 14 / 20px | Control text, tables, navigation, paragraphs |
| Group title | `text-body-lg` | 16 / 22px | Cards and settings groups |
| Dialog title | `text-title` | 20 / 28px | Dialog and primary panel titles |
| Page title | `text-heading` | 24 / 32px | Page heading |
| Display title | `text-display` | 32 / 40px | Low-density introductory pages |

Body uses 400. Titles and action text use 600. Essential information is at least 12px. Settings labels and
navigation use 14–16px. Title line height follows the tokens and is not further compressed to `leading-none`.
Use sentence case, left-align body text, and right-align numeric columns with `tabular-nums`.

| Density | Height | Constraint |
|---|---|---|
| Default / Comfortable | 40px | Default buttons, inputs, and selects; Fluent large is the default size |
| Large | 48px | Large controls extended by MolCrafts |
| Compact | 28px | Must be chosen explicitly, with the space constraint stated; not the default for a scientific workbench |
| Touch target | ≥44px | Touch hit area; enlarge the hit target when needed |

Drop compact-first: default reading and operation stay comfortable. Project navigation rows are at least 40px, and regular padding is at least 8px.
Do not assume a compact layout because an application is a scientific or engineering tool. Compact is an optional adaptation.
Controls on the same row share one density. Do not gain density by shrinking body text or compressing line height.

## 3. Layout, spacing, and shape

4px is the base layout unit. 2px is only for tight padding, strokes, and indicators. Common spacing is
4, 8, 12, 16, 20, 24, and 32px. Related controls are 8px apart, field groups are 16px apart, and
page sections are 24px apart. Cards default to 16px padding, and dialogs to 24px.

| Role | Token | Radius |
|---|---|---|
| checkbox | `rounded-checkbox` | 2px |
| Buttons, inputs, menu items, tooltips | `rounded-control` | 4px |
| Cards, panels | `rounded-panel` | 8px |
| Dialogs, overlays | `rounded-overlay` | 8px |
| Status dots, switch thumbs, avatars | `rounded-full` | circle |

Use a 1px border to establish structure. Corner radius must not vary arbitrarily by page. Component overrides should use semantic roles.
Keep complete table headers, form labels, and reasonable scroll regions. Reflow the layout when width is insufficient.

## 4. Color and theme

All components use semantic slots. Light and dark modes are mapped through the same set of official aliases. **Each product independently owns
the primary and secondary brand-color families.** Product repositories supply light and dark themes separately. The default scaffold
uses Fluent Web blue as primary and the official purple palette as secondary. Defaults
are only a preview baseline for shared components. They do not decide brand color for molexp, molvis, or molhub.

| Role | MolCrafts slot | Official source |
|---|---|---|
| App canvas | `background` | `colorNeutralBackground2` |
| Card and input surfaces | `surface` / `card` | `colorNeutralBackground1` |
| Overlay surface | `popover` | `colorNeutralBackground1` |
| Primary text | `foreground` | `colorNeutralForeground1` |
| Secondary text | `muted-foreground` | `colorNeutralForeground2` |
| Supporting text | `subtle-foreground` | `colorNeutralForeground3` |
| Structural border | `border` | `colorNeutralStroke2` |
| Control border / bottom edge | `input` / `input-bottom` | `colorNeutralStroke1` / `colorNeutralStrokeAccessible` |
| Primary action | `primary` / `primary-hover` / `primary-pressed` | `colorBrandBackground` family |
| Selected background / text | `primary-muted` / `primary-muted-foreground` | `colorBrandBackground2` / `colorBrandForeground2` |
| Link | `primary-link` / `primary-link-hover` | `colorBrandForegroundLink` family |
| Second brand color | `secondary` / `secondary-muted` / `secondary-muted-foreground` | Default official purple palette; products override independently |
| Neutral secondary action | `neutral` / `neutral-foreground` | `colorNeutralBackground1` / `colorNeutralForeground1` |

Each brand family provides a solid background, hover, pressed, foreground on the solid background, a muted
background, and muted-foreground. Primary also provides link / link-hover. CSS names all start with
`--`, for example `--primary-hover` and `--secondary-foreground`. Define states through the full ramp.
Do not change only one base color and then keep the default blue hover or white text.

Primary carries primary actions, selection, and brand links. Secondary is for supporting brand expression and product
identity. It does not override semantic colors such as success, failure, and warning. `Button variant="secondary"` still means
a **neutral secondary action**. It uses neutral slots and is not a second-brand-color button. The old accent / link aliases have been removed. Components use the primary family and primary-link directly.

Override the complete primary / secondary slots on the product root. Local theme containers use
`className="mol-product-theme"`. React reads semantic tokens from the current scope directly. Native
controls bind official camelCase tokens in that scope. Light/dark selectors are maintained by the product. Storybook `Foundations/Product themes` demonstrates two independent light and dark
color sets. The custom palette there is an example only.

Solid brand backgrounds and link text are different roles. They must be mapped separately, especially in dark mode.
Do not overlay light-theme color values onto the dark theme. Do not write hex or arbitrary alpha
in components to simulate a selected state. Use the existing hover, pressed, and selected slots.

## 5. Control states and interaction

Every interactive control must define default, hover, pressed, focus-visible, and disabled.
Forms also need invalid. Selection controls also need checked/selected/indeterminate.

- Primary button: solid brand color and white text. Secondary button: a neutral surface and a clear border. Ghost
  is for toolbars. An action area has one primary button by default.
- Inputs: a neutral surface, a thin border, and a clearer bottom edge. On focus, the bottom edge uses the brand color.
- Navigation and tabs: use a line indicator by default. Selection is not conveyed by changing text color alone. When a segmented
  control is needed, explicitly choose `TabsList variant="default"`.
- Badges convey status and do not look like clickable buttons. The default is a soft fill. Semantic states use
  `success` / `warning` / `info` / `destructive`.
- Dialogs, menus, and popovers keep Radix keyboard interaction, focus management, and dismiss behavior.
  Close buttons use a full control hit area. Do not shrink the click target to the icon size.

## 6. Status semantics

The status vocabulary is fixed: draft, ready, queued, running, completed, failed, cancelled,
cached, warning. Running uses blue, completed uses green, failed uses red, and warning uses
yellow. These semantic roles must not be rebound by product brand colors.

Use a pale background with readable foreground tokens. Status must also have text, and an icon when needed.
The disabled state uses the official disabled slots. Disabled controls do not fire actions. Validation errors provide text
and associate the field with `aria-invalid` / `aria-describedby`.

## 7. Elevation and motion

| Level | Utility | Fluent token |
|---|---|---|
| Ordinary canvas, divided regions | no shadow | surface and border |
| Card | `shadow-card` | `shadow4` |
| Menu, popover, tooltip | `shadow-popup` | `shadow8` |
| Dialog, sheet | `shadow-overlay` | `shadow64` |

Shadows are composed of ambient and key layers. Dark mode uses the official darker shadow colors.
Do not stack the same large shadow on every region. Dialog backdrops use `overlay-scrim`.

Hover/pressed is 100ms, overlay enter is 150ms, and sheet is 200ms. Interaction color uses the official
`curveEasyEase`. Enter/exit uses the official decelerate/accelerate curves. Overlays use only slight scale
and opacity, not bounce. Respect `prefers-reduced-motion`. When motion is reduced,
turn off overlay, accordion, and spinner animation. Loading is still expressed with visible text.

## 8. Icons, content, and accessibility

Use the official Microsoft **`@fluentui/react-icons`** throughout. This check pins the latest published version
**2.0.344**. Action icons default to `Regular`, at 16 / 20 / 24px. Use the matching `Filled` when a selected state
or status dot truly needs it, and keep the same size and visual weight in one context.
Do not mix Lucide, emoji, or other icon libraries. Components in the Registry that use icons declare this dependency.

**Icon-only buttons are preferred over buttons with text.** Toolbars, panel actions, and familiar add/search/settings/
close actions default to `Button size="icon"` (`icon-sm` in compact contexts). Every button
must have an accurate `aria-label`. The icon is `aria-hidden`, and a Tooltip provides a visible
explanation. The Tooltip must appear on both hover and keyboard focus, and cannot be the only accessible name.
Icon size and button hit area are defined separately. Touch hit areas are at least 44px.

Keep text for actions a familiar icon cannot express, for destructive confirmations, and for form submits that need a clear outcome,
such as “Delete permanently”, “Save changes”, and “Cancel”. Icon-only is the preferred rule, not at the cost of understandability.

Normal body contrast is at least 4.5:1, and large text at least 3:1. Discernible control boundaries and focus indicators
are at least 3:1. Keyboard focus uses the inner and outer two-tone indicator of `.mol-focus`. High-contrast systems
use system colors. Every behavior can be completed with the keyboard, and focus returns to the trigger control.

Copy uses explicit actions and objects. Help explains what the user can accomplish. Errors explain how to
recover. Type, theme, and opacity cannot be the only encoding of information.

## 9. Authority files and generation

| File | Responsibility |
|---|---|
| `scripts/build-design-tokens.mjs` | Pinned official reference input → MolCrafts-owned semantic mapping |
| `fluent-theme.css` | Generated light/dark surfaces, action colors, and focus colors |
| `fluent-foundation.css` | Generated shared state, motion, and shadow colors |
| `constitution-theme.css` | Generated type, radii, and control sizes |
| `constitution-base.css` | Shared behavior, soft status backgrounds, focus, animation, and shadow structure |
| `packages/tokens/src/tokens.css` | Tailwind semantic mapping |
| Storybook `Foundations/Constitution` | An interactive visual reference |
| Storybook `Foundations/Product themes` | Product primary / secondary color sets, isolated from neutral and status colors |

Run `pnpm build:tokens` to update generated files. Shared source lives in `packages/tokens/src`.
The plain CSS runtime and the Tailwind integration are built as different entries. React CSS is compiled by `pnpm build:ui`.
CI checks that generated output matches the committed files. Do not edit the three generated files by hand.

When updating the official version, pin a specific `@fluentui/react-theme` version, regenerate,
check light and dark themes and component interaction, and record the version and date. Do not use a floating `latest` dependency.

## 10. Product integration and change acceptance

React consumers import `@molcrafts/ui/styles.css`, which includes the default tokens, compiled utilities, and
preflight, without scanning library source. Framework-agnostic CSS uses `@molcrafts/ui-tokens/runtime.css`.
An application's own Tailwind utilities may use `@molcrafts/ui-tokens/tailwind.css`.
The product supplies complete primary / secondary brand families. Neutral actions use neutral. Status colors stay independent.
The user requires no backward compatibility. Old src paths, a separate public constitution CSS entry, accent/link
aliases, stock radius aliases, product-private cn extensions, and the source-sync workflow have all been removed.
Products migrate directly to the new entries. The concrete list is in [the migration notes](workspace-migration.md).

The default visual stays on the existing Fluent 2 baseline: 4px control radius, 14px control text, 40px default controls and 48px large controls,
8px panels/dialogs, soft status badges, and line tabs. API ownership continues to land in batches per the roadmap.

PR acceptance: typecheck, regenerate tokens, regenerate the registry, and a Storybook build;
light/dark mode and high-contrast mode; keyboard focus, dialog dismiss, form errors, loading, and empty states;
body and status contrast; check at least once on desktop and on a narrow viewport.
Also check the light and dark states of both brand families, the name/Tooltip/keyboard operation of icon-only buttons, and
that neutral secondary actions and semantic status colors stay consistent after the product palette changes.

The Registry provides only package-style integration and composition examples. It no longer distributes core source. Packages declare icon dependencies explicitly.
When a product uses official icons itself, it must also declare them in the product dependencies.

Actual migration of each product's pages is done in a separate product PR. This repository provides the shared baseline and the migration contract.

## 11. Web Components under the same governance

`packages/web-components` is the framework-agnostic shared entry, based on the latest stable official
`@fluentui/web-components` **3.1.3** at the time of the check. React and Web Components follow the same constitution,
primary / secondary color sets, neutral secondary actions, Fluent icons, and accessibility rules.

Web Components use plain CSS and the official camelCase token mapping. Product color sets must
be able to inherit into the Shadow DOM. Consumers are not required to configure Tailwind. Icons use the official
`@fluentui/svg-icons` **1.1.344**, keeping the same Regular visual language as the React icons.
Reduced motion must take effect inside the Shadow DOM. It cannot be applied only by changing host-page styles.

Component scope is managed by `components.json`. Generate types, the registry, and the Custom Elements
Manifest. Rslib/Rspack builds ESM and a standalone browser bundle. A new component should update the manifest, the docs,
Storybook, and browser verification. Thirteen official tags are managed at this stage. Unmanaged components must not be claimed to have reached functional parity with the
React registry. The public API follows native events, attributes, and official slots/parts.

Acceptance also covers standalone consumption from plain HTML, async repeated registration, keyboard operation and Tooltip,
disabled, native form submit, brand color and light/dark, high contrast, and reduced motion. Framework integration and SSR
constraints are in [the Web Components docs](../packages/web-components/README.md).

## Runtime contract (P2)

CSS Custom Properties are the runtime source of truth. Tailwind only maps that same contract.
The full list is in [the token catalog](token-catalog.md). Theme API and scope rules are in
[theming](theming.md). Remaining component-style work is in [the style audit](style-audit.md).
React uses ThemeScope to manage mode, the complete brand, and overlay targets. Native components use the same
`data-mol-theme` mode. An explicit nested mode resets the defaults. The product must pass the brand for the corresponding mode.
An upstream reference-version change must review owned mappings and visual differences. A new version is not applied automatically.
