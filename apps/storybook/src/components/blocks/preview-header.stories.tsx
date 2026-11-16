import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent, within } from "storybook/test";
import { type PreviewAction, PreviewHeader, PreviewNotice } from "@molcrafts/ui";

const noop = () => {};

/** The read-only set a chart preview passes. Clear is there to prove read-only drops it. */
const chartActions: PreviewAction[] = [
  { kind: "button", id: "clear", label: "Clear", icon: "clear", group: "edit", mutates: true, run: noop },
  { kind: "button", id: "fit", label: "Reset view", icon: "reset-view", group: "view", shortcut: "f", run: noop },
  { kind: "button", id: "zoom-in", label: "Zoom in", icon: "zoom-in", group: "view", shortcut: "+", run: noop },
  { kind: "button", id: "zoom-out", label: "Zoom out", icon: "zoom-out", group: "view", shortcut: "-", run: noop },
  { kind: "toggle", id: "fullscreen", label: "Fullscreen", icon: "fullscreen", group: "view", pressed: false, onToggle: noop },
  { kind: "toggle", id: "table", label: "Data table", icon: "table", group: "inspect", pressed: true, onToggle: noop },
  {
    kind: "menu", id: "export", label: "Export", icon: "export", group: "export",
    items: [{ id: "png", label: "PNG image", run: noop }, { id: "svg", label: "SVG vector", run: noop }],
  },
];

const meta = {
  title: "Blocks/PreviewHeader",
  component: PreviewHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { PreviewHeader, PreviewNotice } from "@molcrafts/ui" (or mountPreviewHeader from "@molcrafts/ui/preview" outside React). The one header MolPlot charts, MolVis viewers and sketch boards show in a report: product mark, what the figure shows, one reading, grouped icon actions. Read-only drops every action marked mutates.',
      },
    },
  },
  args: {
    mode: "readonly",
    product: "MolPlot",
    title: "Junction bond lengths after minimization",
    meta: "9 categories · 2 series",
    actions: chartActions,
  },
  render: (args) => (
    <figure className="m-0 w-[44rem] max-w-full overflow-hidden rounded-panel border border-border">
      <PreviewHeader {...args} />
      <div className="relative h-48 bg-surface">
        {args.state && <PreviewNotice state={args.state} />}
      </div>
    </figure>
  ),
} satisfies Meta<typeof PreviewHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ReadOnlyChart: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole("toolbar");
    await expect(within(toolbar).queryByRole("button", { name: "Clear" })).toBeNull();
    await expect(within(toolbar).getByRole("button", { name: "Data table" })).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(within(toolbar).getByRole("button", { name: "Export" }));
    await expect(within(document.body).getByRole("menuitem", { name: "SVG vector" })).toBeVisible();
  },
};

export const EditMode: Story = { args: { mode: "edit", product: "Sketch", title: "unit.json", meta: "71 atoms · 75 bonds" } };

export const Narrow: Story = {
  args: { product: "MolVis", title: "chain10.minimized.pdb", meta: "674 atoms · 732 bonds" },
  render: (args) => (
    <figure className="m-0 w-[20rem] overflow-hidden rounded-panel border border-border">
      <PreviewHeader {...args} />
      <div className="h-32 bg-surface" />
    </figure>
  ),
};

export const Loading: Story = {
  args: { product: "MolVis", title: "trimer.pdb", meta: undefined, state: { kind: "loading", message: "Waiting for the structure…" } },
};

export const OpenElsewhere: Story = {
  args: {
    product: "Sketch",
    title: "Repeat unit",
    meta: undefined,
    state: { kind: "error", message: "This preview is open in another window. Close it there, then reload this page." },
  },
};
