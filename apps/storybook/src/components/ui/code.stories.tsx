import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Code } from "@molcrafts/ui";

const meta = {
  title: "UI/Code",
  component: Code,
  parameters: { docs: { description: { component: 'import { Code } from "@molcrafts/ui"' } } },
} satisfies Meta<typeof Code>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Inline: Story = {
  render: () => <p className="text-body">Import from <Code>@molcrafts/ui</Code>.</p>,
};
export const Block: Story = {
  render: () => (
    <Code variant="block" wrap="anywhere">{`import { Button } from "@molcrafts/ui";
import "@molcrafts/ui/styles.css";`}</Code>
  ),
};
