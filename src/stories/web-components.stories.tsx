import { useEffect, useRef, type CSSProperties } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent, waitFor } from "storybook/test";
import { fluentIcons, registerMolcraftsComponents } from "../../packages/web-components/src/index";
import "../../packages/web-components/src/theme.css";

function WebComponentsPreview({ customBrand = false }: { customBrand?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void registerMolcraftsComponents().then(() => {
      if (cancelled || !ref.current) return;
      const container = ref.current;
      // Trusted, static example markup. Product content should use textContent/framework bindings.
      container.innerHTML = `
        <div class="flex items-center gap-2">
          <fluent-button id="wc-add" appearance="primary" icon-only aria-label="Add item" type="button">${fluentIcons.add}</fluent-button>
          <fluent-tooltip anchor="wc-add" delay="0">Add item</fluent-tooltip>
          <fluent-button type="button">Cancel</fluent-button>
          <fluent-button disabled aria-disabled="true">Disabled</fluent-button>
          <output id="wc-count" aria-live="polite">0 items added</output>
        </div>
        <fluent-field><fluent-label slot="label">Workspace preferences</fluent-label><fluent-text-input slot="input" id="wc-name" value="Workspace">Name</fluent-text-input></fluent-field>
        <fluent-textarea placeholder="Add notes"><span slot="label">Notes</span></fluent-textarea>
        <div class="flex items-center gap-2"><fluent-checkbox id="wc-check" aria-label="Notifications"></fluent-checkbox><label for="wc-check">Notifications</label></div>
        <div class="flex items-center gap-2"><fluent-switch id="wc-switch" aria-label="Auto save" checked></fluent-switch><label for="wc-switch">Auto save</label></div>
        <fluent-divider></fluent-divider>
        <fluent-tablist aria-label="Sections"><fluent-tab>Overview</fluent-tab><fluent-tab>Details</fluent-tab></fluent-tablist>
        <div class="flex items-center gap-2"><fluent-badge appearance="tint" color="success">Completed</fluent-badge><fluent-badge appearance="tint" color="danger">Failed</fluent-badge><fluent-spinner size="tiny" aria-label="Loading"></fluent-spinner><span>Loading</span></div>`;
      let count = 0;
      const button = container.querySelector("#wc-add")!;
      const increment = () => { container.querySelector("#wc-count")!.textContent = `${++count} items added`; };
      button.addEventListener("click", increment);
      container.dataset.ready = "true";
      cleanup = () => { button.removeEventListener("click", increment); container.replaceChildren(); delete container.dataset.ready; };
    });
    return () => { cancelled = true; cleanup?.(); };
  }, []);
  const palette: CSSProperties & Record<string, string> = customBrand ? {
    "--primary": "#007a70", "--primary-hover": "#00665e", "--primary-pressed": "#00574f", "--primary-foreground": "#ffffff",
    "--primary-muted": "#d8f3ed", "--primary-muted-foreground": "#00574f", "--primary-link": "#00665e", "--primary-link-hover": "#00574f",
    "--secondary": "#9b4700", "--secondary-foreground": "#ffffff",
  } : {};
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8 mol-product-theme" style={palette}>
      <h1 className="text-heading font-semibold">Fluent Web Components</h1>
      <p className="text-body text-muted-foreground">Native custom elements with Shadow DOM, shared tokens, and framework-independent APIs.</p>
      <div className="flex gap-2 text-body font-semibold"><span className="rounded-control bg-primary p-3 text-primary-foreground">Primary</span><span className="rounded-control bg-secondary p-3 text-secondary-foreground">Secondary</span></div>
      <div ref={ref} className="grid gap-4 text-body" />
    </main>
  );
}

const meta = {
  title: "Web Components/Foundations",
  component: WebComponentsPreview,
  parameters: { layout: "fullscreen" },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('[data-ready="true"]')).not.toBeNull());
    const action = canvasElement.querySelector("#wc-add") as HTMLElement;
    await userEvent.click(action);
    await expect(canvasElement.querySelector("#wc-count")).toHaveTextContent("1 items added");
    const check = canvasElement.querySelector("#wc-check") as HTMLElement & { checked: boolean };
    await userEvent.click(check);
    await expect(check.checked).toBe(true);
  },
} satisfies Meta<typeof WebComponentsPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { globals: { theme: "light" } };
export const Dark: Story = { globals: { theme: "dark" } };
export const ProductBrand: Story = { args: { customBrand: true }, globals: { theme: "light" } };
