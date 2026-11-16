import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ConsolePane, type ConsoleLine } from "@molcrafts/ui";

const lines: ConsoleLine[] = [
  { id: "1", stream: "info", text: "Starting Pyodide…" },
  { id: "2", stream: "stdout", text: "hello\n" },
  { id: "3", stream: "stderr", text: "ValueError: no\n" },
];

const meta = {
  title: "Blocks/ConsolePane",
  component: ConsolePane,
  parameters: { docs: { description: { component: 'import { ConsolePane } from "@molcrafts/ui". A log of kernel lines. The product can place xterm next to it.' } } },
  args: { lines },
  render: (args) => <div className="h-64 border border-border"><ConsolePane {...args} /></div>,
} satisfies Meta<typeof ConsolePane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLines: Story = {};
export const Empty: Story = { args: { lines: [] } };
