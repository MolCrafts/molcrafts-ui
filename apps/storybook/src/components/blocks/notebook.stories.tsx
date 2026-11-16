import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Notebook, type NotebookCellModel } from "@molcrafts/ui";

const cells: NotebookCellModel[] = [
  { id: "cell-a", execCount: 1, phase: "ok" },
  { id: "cell-b", execCount: null, phase: "idle" },
];

const meta = {
  title: "Blocks/Notebook",
  component: Notebook,
  parameters: { layout: "fullscreen", docs: { description: { component: 'import { Notebook } from "@molcrafts/ui". Cell chrome only. Pass renderEditor and renderOutput for Monaco and MIME output.' } } },
  args: {
    cells,
    renderEditor: (cell) => <div className="rounded-control border border-border px-3 py-2 font-mono text-body">{`print(${cell.id})`}</div>,
    renderOutput: (cell) => cell.phase === "ok" ? <pre className="font-mono text-body">hello</pre> : null,
  },
  render: (args) => <div className="h-[32rem]"><Notebook {...args} /></div>,
} satisfies Meta<typeof Notebook>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoCells: Story = {};
export const Busy: Story = { args: { busy: true, cells: [{ id: "cell-a", execCount: 2, phase: "running" }] } };
