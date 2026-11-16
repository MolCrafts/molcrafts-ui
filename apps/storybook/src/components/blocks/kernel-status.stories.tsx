import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { KernelStatus } from "@molcrafts/ui";

const meta = {
  title: "Blocks/KernelStatus",
  component: KernelStatus,
  parameters: { docs: { description: { component: 'import { KernelStatus } from "@molcrafts/ui". The kernel phase, with the status word always visible next to the dot.' } } },
  args: { phase: "ready" },
} satisfies Meta<typeof KernelStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
export const Starting: Story = { args: { phase: "loading" } };
export const Running: Story = { args: { phase: "busy" } };
export const Failed: Story = { args: { phase: "error", error: "micropip install failed: HTTP 404" } };
