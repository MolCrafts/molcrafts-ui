import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Code } from "@molcrafts/design";

const meta = {
  title: "UI/Code",
  component: Code,
  parameters: { docs: { description: { component: 'import { Code } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Code>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Inline: Story = {
  render: () => <p className="text-body">Import from <Code>@molcrafts/design</Code>.</p>,
};
export const Block: Story = {
  render: () => (
    <Code variant="block" wrap="anywhere">{`import { Button } from "@molcrafts/design";
import "@molcrafts/design/styles.css";`}</Code>
  ),
};
