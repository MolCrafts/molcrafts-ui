# P2 style audit

2026-10-10. The canonical source is packages/ui and packages/tokens. The user requires no backward compatibility.
Old color aliases, source copies, and product-private merge scales were removed in P1.

## Landed

- React components have no hex/rgb colors, no default red/blue/slate/zinc/gray utility ramps, and no new icon library.
- Shared color uses MolCrafts semantic roles. Brand, neutral actions, and status families are separate.
- geometry/type utilities now read runtime CSS and support foundation changes under a scope.
- All 8 overlay kinds mount to the nearest ThemeScope. Mode and brand changes take effect immediately while open.
- Light/dark status aliases rebind in a local scope. The native official mapping also supports the same data-mol-theme attribute.
- tokens add border/focus/spacing/font-weight foundation and generate a machine-readable catalog.

## Still to handle per component in P3

| Pattern | Assessment / next action |
| --- | --- |
| `top-1/2`, translate, Radix available-height/transform-origin, drag pixel values | Behavior and position data, not arbitrary design color values; keep mature primitives and layout behavior |
| Sheet w-3/4/max-w-sm, Dialog sm:max-w-lg, Popover w-72 | Still generic Tailwind layout. Later formal size variants should unify their public size contract |
| Switch/Slider/Checkbox size and spacing units | Shared spacing is already MolCrafts-owned. Later, verify size, touch hit area, and state contracts |
| disabled opacity, some hover alpha/ring alpha | Control states still need to be unified in P3. P2 theme tests do not replace full acceptance of component states |
| CSS constants for spinner ring size and overlay scale | Currently in shared CSS. If exposed as a component customization contract, document them formally with P3 |
| Internal numbers in upstream native CSS | Belong to a mature independent runtime. Manage them only through public slots/parts and shared tokens. Do not claim full React API or visual parity |

P2 verification covers themes, key combinations, and basic quality gates. It has not completed the public contract,
every interaction state, or a full visual baseline for all 33 components. Full progress is in the roadmap.
