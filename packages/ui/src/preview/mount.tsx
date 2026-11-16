/**
 * Mount the preview header and notice from code that is not React: the
 * `<molplot-chart>` element and the sketch board.
 *
 * Each mounts into a shadow root that holds `@molcrafts/ui/styles.css`, so a
 * docs page around a chart keeps its own styles and the header keeps the
 * MolCrafts ones. Tooltips and menus portal inside the same root.
 */

import type { ThemeMode } from "@molcrafts/ui-tokens";
import { createRoot } from "react-dom/client";
import { PreviewHeader, PreviewNotice } from "../components/blocks/preview-header";
import type { PreviewHeaderOptions, PreviewState } from "../lib/preview";
import { ThemeScope } from "../theme/theme-scope";

// The contract travels with the mount, so a consumer of this subpath never
// loads the full component index.
export {
  parsePreviewMode,
  previewActions,
  previewFileName,
  PREVIEW_GROUPS,
  PREVIEW_ICONS,
  PREVIEW_MODES,
  type PreviewAction,
  type PreviewButtonAction,
  type PreviewGroup,
  type PreviewHeaderOptions,
  type PreviewIconName,
  type PreviewMenuAction,
  type PreviewMenuItem,
  type PreviewMode,
  type PreviewState,
  type PreviewToggleAction,
} from "../lib/preview";

export interface PreviewMountOptions {
  /** The text of `@molcrafts/ui/styles.css` (import it with `?raw`). */
  stylesheet: string;
  /** Omit to follow the surrounding `.dark` class. */
  theme?: ThemeMode;
}

export interface MountedPreviewHeader {
  /** Replace title, meta, state or actions. The mode is fixed at mount. */
  update(next: Partial<Omit<PreviewHeaderOptions, "mode">>): void;
  destroy(): void;
}

export interface MountedPreviewNotice {
  update(state: PreviewState): void;
  destroy(): void;
}

function shadowContainer(host: HTMLElement, mount: PreviewMountOptions): HTMLElement {
  const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
  shadow.replaceChildren();
  const style = host.ownerDocument.createElement("style");
  style.textContent = `${mount.stylesheet}\n:host { display: block; }`;
  const container = host.ownerDocument.createElement("div");
  shadow.append(style, container);
  return container;
}

function themeOf(host: HTMLElement, mount: PreviewMountOptions): ThemeMode {
  return mount.theme ?? (host.closest(".dark") ? "dark" : "light");
}

export function mountPreviewHeader(
  host: HTMLElement,
  options: PreviewHeaderOptions,
  mount: PreviewMountOptions,
): MountedPreviewHeader {
  const root = createRoot(shadowContainer(host, mount));
  let current = options;
  const render = () =>
    root.render(
      <ThemeScope theme={themeOf(host, mount)}>
        <PreviewHeader {...current} />
      </ThemeScope>,
    );
  render();
  return {
    update(next) {
      current = { ...current, ...next };
      render();
    },
    destroy() {
      root.unmount();
    },
  };
}

/** A centered notice for loading, empty and error states. `host` fills the canvas and is positioned. */
export function mountPreviewNotice(host: HTMLElement, state: PreviewState, mount: PreviewMountOptions): MountedPreviewNotice {
  const root = createRoot(shadowContainer(host, mount));
  const render = (next: PreviewState) => {
    host.hidden = next.kind === "ready";
    root.render(
      <ThemeScope theme={themeOf(host, mount)} className="bg-transparent">
        <PreviewNotice state={next} />
      </ThemeScope>,
    );
  };
  render(state);
  return {
    update: render,
    destroy() {
      root.unmount();
    },
  };
}
