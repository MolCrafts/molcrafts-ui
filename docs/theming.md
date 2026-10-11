# Tokens and the theme contract

Contract v1 · 2026-10-10. Full defaults are in [the generated token catalog](token-catalog.md).
CSS Custom Properties are the runtime source of truth. Metadata describes the defaults. React types do not depend on a specific application.
MolCrafts owns semantic names, mappings, defaults, and upgrade decisions. Fluent 2 is a pinned-version reference input.

## Entries and layers

| Entry | Purpose |
| --- | --- |
| `@molcrafts/design-tokens/runtime.css` | Flat plain CSS: color, type, geometry, state, focus, motion, and elevation |
| `@molcrafts/design-tokens/tailwind.css` | Optional Tailwind v4 mapping that consumes the same runtime variables |
| `@molcrafts/design-tokens` | Framework-agnostic ProductTheme/BrandPalette/ThemeMode types and tokenContract metadata |
| `@molcrafts/design-tokens/contract.json` | Built machine-readable inventory of default tokens |
| `@molcrafts/design/styles.css` | Tokens, all React utilities, and preflight; React consumers usually need only this entry |

Foundation includes the Segoe UI font stack, type size/line height/font weight, the 4px spacing unit, semantic control/
layout sizes, border/focus width and offset, radii, shadows, and motion. Semantic roles include
background/surface/foreground/border, complete primary/secondary, neutral/muted, status, and
hover/pressed/disabled/focus. Color roles are used by purpose. Brand color must not replace status color.
Tailwind geometry and typography utilities read the actual CSS variables instead of baking defaults into the utility.

## Plain CSS and scope

```html
<section data-mol-theme="dark" class="mol-product-theme">
  <!-- plain HTML / Web Components -->
  <section data-mol-theme="light">Independent light region</section>
</section>
```

`.dark` may select global dark. `data-mol-theme="light|dark"` selects a complete theme on any root, container, or native host.
An explicit mode resets that scope's default brand, status, and foundation, and supports light-in-dark
and dark-in-light. Omitting the mode attribute inherits the parent. Derived values in CSS for status aliases, shadows, and motion
are rebound in the theme/product scope. They do not inherit an ancestor's already computed soft backgrounds.

A plain CSS theme is not carried automatically onto external DOM. If a native overlay mounts outside the scope, the product must select the same theme on its target.
Shared Web Components currently use their own Shadow DOM. Official camelCase
and MolCrafts roles are bound in the theme/product scope. Tailwind or React is not required.

## React ThemeScope

```tsx
import { ThemeScope, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, Button } from "@molcrafts/design";
import type { ProductTheme, ThemeMode } from "@molcrafts/design-tokens";
import "@molcrafts/design/styles.css";

// lightBrand/darkBrand are the product's complete, contrast-checked ProductTheme objects.
function ProductArea({ mode, lightBrand, darkBrand }: {
  mode: ThemeMode; lightBrand: ProductTheme; darkBrand: ProductTheme;
}) {
  return <ThemeScope theme={mode} brand={mode === "dark" ? darkBrand : lightBrand}>
    <Dialog><DialogTrigger asChild><Button>Open details</Button></DialogTrigger>
      <DialogContent><DialogTitle>Details</DialogTitle><DialogDescription>Product-themed content.</DialogDescription></DialogContent>
    </Dialog>
  </ThemeScope>;
}
```

- `theme?: "light" | "dark"` is the controlled mode. When omitted, it inherits the surrounding CSS. The component does not manage application state.
- `brand?: ProductTheme` contains two complete brand families. When the mode is explicit and brand is omitted, that mode's
  default Fluent preview brand is used. To keep a product brand, pass the corresponding brand object explicitly.
- Supports div native attributes, a React 19 ref, children, className, and style. style may customize documented
  semantic slots. Product data and validation logic do not belong in ThemeScope.
- Child dialog/alert-dialog/sheet/popover/tooltip/select/dropdown/context-menu portals
  mount by default to the nearest scope's dedicated host and automatically inherit the complete tokens and the user's CSS overrides.
  With no outer ThemeScope, they keep the default document body mount.
- The host does not participate in layout. SSR emits only the theme and ordinary children. The portal waits until the client host mounts. It does not access
  document, read computed styles, or copy the theme synchronously. The first render does not briefly mount onto the wrong body theme.
- Modal keyboard dismiss, focus trap/return, and the existing mature primitives remain responsible.
- The portal preserves DOM scope, so CSS on scope ancestors such as transform, contain, and overflow can still
  change overlay positioning and clipping. Place ThemeScope outside those containers. Do not patch with broad DOM selectors.
  When the underlying portal container is used explicitly, the consumer is responsible for the target's theme and positioning.

## Product color sets

| CSS family | Typed field | Role |
| --- | --- | --- |
| `--primary`, `--secondary` | background | Solid brand action/expression |
| `--*-hover`, `--*-pressed` | hover / pressed | Interaction states |
| `--*-foreground` | foreground | Text and icons on a solid background |
| `--*-muted`, `--*-muted-foreground` | muted / mutedForeground | Soft selection and brand hints |
| `--primary-link`, `--primary-link-hover` | primary.link / linkHover | Readable links separated from the solid background |

`ProductTheme.primary` is a PrimaryPalette and `secondary` is a BrandPalette. Every listed
field must be provided. Missing ramps are not guessed. Light and dark brand objects may differ. The product is responsible for contrast of actual combinations such as hover, pressed,
link, and muted. Brand changes only the brand families. Neutral actions and success/warning/
danger/info stay shared. Button variant="secondary" is a neutral secondary action, not a second-brand-color button.

Text is usually at least 4.5:1, larger text is 3:1, and focus and necessary control boundaries are 3:1. State must not be conveyed by color alone.
Icon-only actions have an accurate name and a visible explanation. There are no old accent/link, stock radius, or product-private cn aliases.

## Environment state and customization boundaries

`prefers-reduced-motion` disables shared spinner/overlay/accordion animation and drops interaction duration
to 0, while accessible state remains. `forced-colors` uses system colors such as Highlight and ButtonText, rather than
forcing brand color to remain. focus-width/offset together with ring/focus-inner establish the focus indicator.

The default control is a comfortable 40px, explicit compact is 28px, large control-comfortable is 48px, and the touch target is at least 44px.
The default control radius is 4px, panel/overlay is 8px, and checkbox is 2px. Changing foundation affects every
component that depends on it. That is a versioned style contract, not advice to change control density arbitrarily per page.
Component variants and slots take priority over broad DOM overrides. Do not casually add per-component tokens.

## Upstream upgrades and verification

`packages/tokens/reference.json` records the reference package and version. The generator rejects an upgrade whose dependency version
does not match the record. When changing owned mappings or the upstream version:

1. Check the stable release and the changes, update the pinned dependency and the reference record, and state which visual changes are accepted or rejected.
2. `pnpm build:tokens` / `pnpm build:packages` updates CSS, the catalog, and the native mappings.
3. Verify nested light/dark, complete brands, all overlay families, keyboard, forced-colors, and reduced-motion.
4. `pnpm build:consumer && pnpm test:consumer` checks a11y/contrast and screenshots; then run Storybook and the native tests.
5. If a visual change is expected, update screenshots on Linux with the Playwright Chromium that matches the lockfile, and review them.
   CI does not update baselines automatically. Do not skip color or axe rules to make tests pass.

Raw token numbers appear only in the tokens source of truth or in documented derivation rules. CSS metadata does not introduce React,
primitives, or a Fluent runtime dependency, and does not require a recompile when the theme switches.
