import {
  knownPreset,
  parseAspect,
  parseInteractive,
  parseThemeMode,
  prepareChartSpec,
  readHostStyle,
  readSpec,
  schemeIsDark,
  specHasEmptyValues,
} from "@molcrafts/ui-vega/preset";
import { mountVegaSvg, type MountedVegaView } from "@molcrafts/ui-vega/view";

const STYLE_ID = "molcrafts-chart-defaults";

function installElementStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
:where([data-molcrafts-chart]) {
  display: block;
  position: relative;
  box-sizing: border-box;
  width: min(100%, var(--molplot-width, 28rem));
  aspect-ratio: var(--molplot-aspect, 16 / 10);
  padding: 0.5rem;
  overflow: hidden;
}
:where([data-molcrafts-chart]) > :where(.molcrafts-chart__surface) {
  position: absolute;
  inset: 0.5rem;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
:where([data-molcrafts-chart]) > :where(.molcrafts-chart__status[data-visible]) {
  position: absolute;
  inset: 0.5rem;
  z-index: 1;
  box-sizing: border-box;
  margin: 0;
  padding: 1rem;
  overflow: auto;
  color: inherit;
  font: inherit;
  white-space: pre-wrap;
}
`;
  document.head.appendChild(style);
}

function prefersDark(): boolean {
  const root = document.documentElement;
  const schemeMedia = typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
  return schemeIsDark({
    rootClassDark: root.classList.contains("dark"),
    rootScheme: root.getAttribute("data-md-color-scheme"),
    bodyScheme: document.body?.getAttribute("data-md-color-scheme") ?? null,
    prefersDark: schemeMedia,
  });
}

/**
 * Register `<molcrafts-chart>`. Idempotent. A no-op without `customElements`,
 * so importing this module from Node does not touch the DOM.
 * The class is created inside the function so `extends HTMLElement` is not
 * evaluated during SSR.
 */
export function defineMolcraftsChart(tag = "molcrafts-chart"): void {
  if (typeof customElements === "undefined" || typeof HTMLElement === "undefined") return;
  if (customElements.get(tag)) return;
  installElementStyles();

  class MolcraftsChartElement extends HTMLElement {
    static readonly observedAttributes = [
      "spec", "preset", "theme", "interactive", "width", "aspect", "label", "label-hidden",
    ];

    private view: MountedVegaView | null = null;
    private surface: HTMLElement | null = null;
    private status: HTMLElement | null = null;
    private generation = 0;
    private resizeObserver: ResizeObserver | null = null;
    private themeObserver: MutationObserver | null = null;
    private resizeFrame: number | null = null;
    private lastWidth = 0;
    private lastHeight = 0;
    private media: MediaQueryList | null = null;
    private onMedia: (() => void) | null = null;

    connectedCallback(): void {
      this.setAttribute("data-molcrafts-chart", "");
      this.removeAttribute("data-molcrafts-embed-error");
      for (const box of Array.from(this.querySelectorAll("[data-molcrafts-embed-error-msg]"))) box.remove();
      this.setAttribute("role", "figure");
      this.applySizing();
      this.applyLabel();
      this.ensureHosts();
      this.observe();
      void this.render();
    }

    disconnectedCallback(): void {
      this.generation += 1;
      this.resizeObserver?.disconnect();
      this.themeObserver?.disconnect();
      this.resizeObserver = null;
      this.themeObserver = null;
      if (this.media && this.onMedia) this.media.removeEventListener("change", this.onMedia);
      this.media = null;
      this.onMedia = null;
      if (this.resizeFrame !== null) cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = null;
      this.teardownView();
    }

    attributeChangedCallback(name: string): void {
      if (!this.isConnected) return;
      if (name === "width" || name === "aspect") this.applySizing();
      if (name === "label" || name === "label-hidden") this.applyLabel();
      this.lastWidth = 0;
      this.lastHeight = 0;
      void this.render();
    }

    private applyLabel(): void {
      const label = this.getAttribute("label")?.trim() || "Chart";
      this.setAttribute("aria-label", label);
    }

    private applySizing(): void {
      const width = this.getAttribute("width");
      const aspect = this.getAttribute("aspect");
      if (width) this.style.setProperty("--molplot-width", width);
      else this.style.removeProperty("--molplot-width");
      if (aspect) this.style.setProperty("--molplot-aspect", aspect.replace(":", " / "));
      else this.style.removeProperty("--molplot-aspect");
    }

    private ensureHosts(): void {
      if (!this.status) {
        const status = document.createElement("p");
        status.className = "molcrafts-chart__status";
        status.setAttribute("role", "status");
        this.append(status);
        this.status = status;
      }
      if (!this.surface) {
        const surface = document.createElement("div");
        surface.className = "molcrafts-chart__surface";
        surface.setAttribute("aria-hidden", "true");
        this.append(surface);
        this.surface = surface;
      }
    }

    private observe(): void {
      if (!this.resizeObserver && typeof ResizeObserver !== "undefined" && this.surface) {
        this.resizeObserver = new ResizeObserver(() => this.schedule());
        this.resizeObserver.observe(this.surface);
      }
      if (!this.themeObserver && typeof MutationObserver !== "undefined") {
        this.themeObserver = new MutationObserver(() => {
          this.lastWidth = 0;
          void this.render();
        });
        this.themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["class", "data-md-color-scheme"],
        });
        if (document.body) {
          this.themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ["class", "data-md-color-scheme"],
          });
        }
      }
      if (!this.media && typeof matchMedia === "function") {
        this.media = matchMedia("(prefers-color-scheme: dark)");
        this.onMedia = () => { this.lastWidth = 0; void this.render(); };
        this.media.addEventListener("change", this.onMedia);
      }
    }

    private schedule(): void {
      if (this.resizeFrame !== null) return;
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = null;
        const size = this.measure();
        if (size.width === this.lastWidth && size.height === this.lastHeight && this.view) return;
        void this.render();
      });
    }

    private measure(): { width: number; height: number } {
      const rect = this.surface?.getBoundingClientRect();
      const aspect = parseAspect(this.getAttribute("aspect"));
      let width = Math.round(rect?.width || 0);
      let height = Math.round(rect?.height || 0);
      if (width < 2) width = 640;
      if (height < 2) height = Math.max(1, Math.round(width / aspect));
      return { width, height };
    }

    private setStatus(state: "loading" | "ready" | "empty" | "error", message = ""): void {
      this.dataset.state = state;
      this.setAttribute("aria-busy", state === "loading" ? "true" : "false");
      if (!this.status) return;
      this.status.textContent = message;
      if (state === "error" || state === "empty") this.status.setAttribute("data-visible", "");
      else this.status.removeAttribute("data-visible");
    }

    private teardownView(): void {
      this.view?.finalize();
      this.view = null;
      if (this.surface) this.surface.replaceChildren();
    }

    private async render(): Promise<void> {
      const generation = ++this.generation;
      this.ensureHosts();
      const surface = this.surface;
      if (!surface) return;
      const preset = knownPreset(this.getAttribute("preset"));
      if (!preset) {
        this.fail(generation, `unknown chart preset "${this.getAttribute("preset")}"`);
        return;
      }
      const script = this.querySelector('script[type="application/json"]');
      const parsed = readSpec(script?.textContent ?? this.getAttribute("spec"));
      if (!parsed.spec) {
        const message = parsed.reason === "empty"
          ? "missing Vega-Lite spec (empty JSON script / spec attribute)"
          : "invalid Vega-Lite JSON";
        this.fail(generation, message);
        return;
      }
      if (specHasEmptyValues(parsed.spec)) {
        this.teardownView();
        this.setStatus("empty", "No chart data.");
        return;
      }
      const size = this.measure();
      this.lastWidth = size.width;
      this.lastHeight = size.height;
      const mode = parseThemeMode(this.getAttribute("theme"));
      const resolved = mode === "auto" ? (prefersDark() ? "dark" : "light") : mode;
      const host = readHostStyle(this);
      const hidden = this.hasAttribute("label-hidden");
      const label = this.getAttribute("label")?.trim() || "";
      const prepared = prepareChartSpec(parsed.spec, {
        preset,
        mode: resolved,
        width: size.width,
        height: size.height,
        aspectRatio: parseAspect(this.getAttribute("aspect")),
        interactive: parseInteractive(this.getAttribute("interactive")),
        hostFontPx: host.fontSizePx,
        ink: host.color,
        title: !hidden && label ? label : null,
      });
      this.setStatus("loading", "Loading chart…");
      try {
        const { compile } = await import("vega-lite");
        if (generation !== this.generation) return;
        const compiled = compile(prepared.spec as never).spec;
        if (generation !== this.generation) return;
        this.teardownView();
        const view = mountVegaSvg(surface, compiled);
        this.view = view;
        await view.runAsync();
        if (generation !== this.generation) {
          view.finalize();
          if (this.view === view) this.view = null;
          return;
        }
        this.setStatus("ready");
        this.dispatchEvent(new CustomEvent("molcrafts:ready", { bubbles: true, composed: true }));
      } catch (cause) {
        if (generation !== this.generation) return;
        const message = cause instanceof Error ? cause.message : String(cause);
        this.fail(generation, message);
      }
    }

    private fail(generation: number, message: string): void {
      if (generation !== this.generation) return;
      this.teardownView();
      this.setStatus("error", `molcrafts-chart: ${message}`);
      this.dispatchEvent(new CustomEvent("molcrafts:error", {
        detail: { error: new Error(message) },
        bubbles: true,
        composed: true,
      }));
    }
  }

  customElements.define(tag, MolcraftsChartElement);
}
