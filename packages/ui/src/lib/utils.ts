import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** MolCrafts-owned semantic scales; product-only extensions stay in products. */
const FONT_SIZES = ["micro", "label", "body", "body-lg", "title", "heading", "display"] as const;
const RADII = ["control", "panel", "overlay", "checkbox"] as const;
const SPACING = [
  "control-compact", "control", "control-comfortable", "toolbar-compact", "toolbar",
  "statusbar", "touch-target", "menu", "dialog-sm", "dialog-md", "dialog-lg",
  "dialog-scroll", "overlay-viewport",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
      rounded: [{ rounded: [...RADII] }],
      h: [{ h: [...SPACING] }],
      "min-h": [{ "min-h": [...SPACING] }],
      "max-h": [{ "max-h": [...SPACING] }],
      w: [{ w: [...SPACING] }],
      "min-w": [{ "min-w": [...SPACING] }],
      "max-w": [{ "max-w": [...SPACING] }],
      size: [{ size: [...SPACING] }],
    },
  },
});

/** Merge class names; later Tailwind utilities win over earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
