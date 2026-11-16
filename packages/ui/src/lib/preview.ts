/**
 * The preview contract: the header MolPlot charts, MolVis viewers and sketch
 * boards show when a report frames them. Pure types and helpers; the React
 * header is `components/blocks/preview-header.tsx`.
 *
 * Every preview declares a mode. `readonly` drops every action that changes
 * the content (`mutates: true`), whatever the product passes. View state
 * (zoom, projection, a hidden series) is not content and stays available.
 */

export const PREVIEW_MODES = ["readonly", "edit"] as const;
export type PreviewMode = (typeof PREVIEW_MODES)[number];

/** Groups, in the order the header shows them. */
export const PREVIEW_GROUPS = ["edit", "view", "inspect", "export"] as const;
export type PreviewGroup = (typeof PREVIEW_GROUPS)[number];

/** The icons a preview action may use; one Fluent Regular set for every product. */
export const PREVIEW_ICONS = [
  "reset-view",
  "zoom-in",
  "zoom-out",
  "fullscreen",
  "exit-fullscreen",
  "table",
  "projection",
  "spin",
  "style",
  "export",
  "undo",
  "redo",
  "clear",
] as const;
export type PreviewIconName = (typeof PREVIEW_ICONS)[number];

interface PreviewActionBase {
  id: string;
  /** Accessible name and tooltip. */
  label: string;
  icon: PreviewIconName;
  group: PreviewGroup;
  /** Changes the content (not just the view). Dropped in read-only mode. */
  mutates?: boolean;
  /** One key, without modifiers, e.g. "f" or "+". Shown in the tooltip. */
  shortcut?: string;
  disabled?: boolean;
}

export interface PreviewButtonAction extends PreviewActionBase {
  kind: "button";
  run(): void;
}

export interface PreviewToggleAction extends PreviewActionBase {
  kind: "toggle";
  pressed: boolean;
  onToggle(pressed: boolean): void;
}

export interface PreviewMenuItem {
  id: string;
  label: string;
  run(): void;
  /** A choice among siblings, shown as a radio item. */
  checked?: boolean;
}

export interface PreviewMenuAction extends PreviewActionBase {
  kind: "menu";
  items: readonly PreviewMenuItem[];
}

export type PreviewAction = PreviewButtonAction | PreviewToggleAction | PreviewMenuAction;

export type PreviewState =
  | { kind: "ready" }
  | { kind: "loading"; message?: string }
  | { kind: "empty"; message: string }
  | { kind: "error"; message: string };

export interface PreviewHeaderOptions {
  mode: PreviewMode;
  /** The product, shown as a quiet mark: "MolPlot", "MolVis", "Sketch". */
  product: string;
  /** What the figure shows: a file name or a chart title. */
  title?: string;
  /** One short reading, e.g. "674 atoms · 732 bonds". */
  meta?: string;
  state?: PreviewState;
  actions: readonly PreviewAction[];
}

/**
 * Read a `mode` attribute or URL parameter. Absent means `readonly`, the
 * mode in which nothing can change. Any other value is an error.
 */
export function parsePreviewMode(value: string | null | undefined): PreviewMode {
  if (value === null || value === undefined || value.trim() === "") return "readonly";
  const mode = value.trim();
  if ((PREVIEW_MODES as readonly string[]).includes(mode)) return mode as PreviewMode;
  throw new Error(`Invalid preview mode "${value}". Expected: ${PREVIEW_MODES.join(", ")}.`);
}

/**
 * The actions a header shows, grouped in {@link PREVIEW_GROUPS} order and
 * stable within a group. Read-only never shows an action that mutates.
 */
export function previewActions(mode: PreviewMode, actions: readonly PreviewAction[]): PreviewAction[] {
  const order = (group: PreviewGroup) => PREVIEW_GROUPS.indexOf(group);
  return actions
    .map((action, index) => ({ action, index }))
    .filter(({ action }) => mode === "edit" || action.mutates !== true)
    .sort((a, b) => order(a.action.group) - order(b.action.group) || a.index - b.index)
    .map(({ action }) => action);
}

/** A download name from what the figure shows: "Junction bond lengths" → "junction-bond-lengths.png". */
export function previewFileName(title: string | undefined, extension: string, fallback = "figure"): string {
  const stem = (title ?? "")
    .normalize("NFKD")
    .replace(/\.[a-z0-9]{1,5}$/i, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${stem === "" ? fallback : stem}.${extension.replace(/^\./, "")}`;
}
