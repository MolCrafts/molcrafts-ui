# @molcrafts/ui-web-components

The framework-agnostic Fluent 2 entry point for MolCrafts. It is based on the official `@fluentui/web-components` **3.1.3**
and uses FAST Web Components. It does not depend on React or Tailwind. It shares the design constitution,
product primary / secondary, light and dark modes, and accessibility acceptance rules with the React primitives.

Install the published package. `0.1.0-alpha.0` is on the npm `alpha` tag. There is no older-name alias.

```bash
npm install @molcrafts/ui-web-components@0.1.0-alpha.0
```

```ts
import '@molcrafts/ui-web-components/theme.css';
import { registerMolcraftsComponents } from '@molcrafts/ui-web-components';
await registerMolcraftsComponents();
```

Or use the auto-registration entry point `import '@molcrafts/ui-web-components/register'`.
Registration is asynchronous, and calling it again is safe. If the same page already contains a Fluent element of another version with the same name, registration fails with an explicit error.
Official `fluent-*` tags and their attributes/API are kept, so keyboard behavior, forms, and ARIA are not reimplemented.

Plain HTML can copy `dist/` into a static asset directory and load it directly, with no import map:

```html
<link rel="stylesheet" href="/ui/theme.css">
<script type="module" src="/ui/browser/browser.js"></script>
<fluent-button appearance="primary" type="button">Save changes</fluent-button>
<fluent-text-input name="name" required>Name</fluent-text-input>
```

The ESM package entry points are bundled by the consumer. `browser.js` is a standalone ESM bundle that includes runtime dependencies.
Both entry points run in the browser. For SSR, dynamically import and register during client mount.
The server should only emit the tags. Do not execute the package entry points on the server.

## Managed scope

`components.json` is the component and icon inventory. It currently manages 13 tags: button, badge,
checkbox, switch, text-input, textarea, label, field, divider, spinner,
tab, tablist, and tooltip (all with the `fluent-` prefix). The inventory generates the registry, TypeScript
tag types, the Custom Elements Manifest for the official API, and the build assets.

This is an independent Web Components API. React props such as `variant` and `onCheckedChange`
do not map directly onto the native elements. Use the official `appearance` attribute, element properties, and
native `input` / `change` / `click` events. Components not yet in the inventory are not promised to match the React
registry. Extending the set requires Storybook, the manifest, and browser acceptance to be completed.

## Theme and icons

`theme.css` is plain CSS and contains no Tailwind directives. It imports shared colors and states, and maps
primary, neutral, disabled, and focus onto the official camelCase tokens so that color
inheritance reaches into the Shadow DOM. Generated official host styles protect controls from page resets.
Styles inside the Shadow DOM remain managed by the official components. A product overrides the complete
primary / secondary light and dark color groups on the root element or a `.mol-product-theme` container. The concrete contract is the repository design constitution. There is no need to call the official
`setTheme()`, which would overwrite the shared theme contract.

`fluentIcons` provides Regular SVG strings from the official `@fluentui/svg-icons` **1.1.344** for icons listed in the inventory.
They are inlined and distributed by the generation pipeline, with no React dependency. The strings include `aria-hidden` and
`currentColor`, and are suitable as decorative button icons. To add more icons, put them in the inventory and regenerate.

```ts
import { fluentIcons } from '@molcrafts/ui-web-components';
const add = document.createElement('fluent-button');
add.appearance = 'primary';
add.type = 'button';
add.iconOnly = true;
add.id = 'add-item';
add.setAttribute('aria-label', 'Add item');
add.innerHTML = fluentIcons.add; // Use only the fixed SVG provided by the package; put user content in textContent.
document.body.append(add);
```

Pair it with `<fluent-tooltip anchor="add-item">Add item</fluent-tooltip>` for hover and
keyboard hints. Toolbars prefer icon-only actions. Keep text for form confirmations and for actions whose meaning is unclear.
The standard height is 32px, small is sized for 28px, and large is 40px. Touch hit targets are at least 44px.
CSS tokens must not depend on reaching into the internal Shadow DOM. Use public attributes and `::part`.

Text inputs take their label from the default slot: `<fluent-text-input>Name</fluent-text-input>`.
A textarea uses `<span slot="label">Notes</span>`. Setting `aria-label` only on the host
does not guarantee that the inner native input receives a name. Put a textarea's initial content in the default slot, and set later values
through the element's `value` property. `fluent-label` provides visual styling and is not equivalent to a native label.

## Framework integration

In the Vue build configuration, treat `fluent-` tags as custom elements, for example:

```ts
// compilerOptions for the Vue compiler / vue-loader (for example, the Rsbuild Vue plugin)
isCustomElement: (tag: string) => tag.startsWith('fluent-')
```

```vue
<fluent-text-input name="name" @input="onInput">Name</fluent-text-input>
```

In Angular, add `CUSTOM_ELEMENTS_SCHEMA` to the consuming component's `schemas`, and use native
events and property binding. Two-way forms need a ControlValueAccessor adapter in the consumer.
React 19 supports custom elements. Use `createElement('fluent-button', props)` or the consumer's
own JSX declarations. Connect complex native events with a ref / addEventListener, and remove the listeners.
Svelte and plain HTML use the tags directly. The frameworks above share the same browser registration entry point.

Browsers must support Custom Elements, Shadow DOM, and ElementInternals / form-associated custom elements.
Tooltips also use modern Popover / CSS anchor positioning. Compatibility fallbacks are managed by the official implementation.

## Development acceptance

```bash
pnpm generate:web-components
pnpm typecheck
pnpm build:web-components
pnpm exec playwright install chromium
pnpm test:web-components
pnpm build:storybook
```

The Storybook sidebar `Web Components` lists one story per managed tag.
`Web Components/Foundations` is the combined page. React serves only as the Storybook host.
`pnpm verify:stories` requires a title for every class in `components.json`.
An Impeccable review targets one named story and does not walk the group automatically.
CI checks generated files, the ESM package, the standalone HTML bundle, repeated registration, keyboard
behavior and Tooltip, disabled state, native FormData/submit, brand-color penetration, light and dark modes, reduced motion, and high contrast.
The build exports `custom-elements.json` for IDEs and other Web Components tools to consume.

Shared sources for color, geometry, and behavior live in `packages/tokens`. At build time, that package's standalone runtime CSS
is folded into this package's `theme.css`. A source copy of the shared tokens is no longer maintained.

MIT licensed. See LICENSE, NOTICE.md and THIRD_PARTY_NOTICES.md included in this archive.
Release preparation: https://github.com/MolCrafts/molcrafts-ui/blob/master/docs/releasing.md
