import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Callout } from "@molcrafts/ui";

const meta = {
  title: "UI/Callout",
  component: Callout,
  parameters: {
    docs: {
      description: {
        component:
          'import { Callout } from "@molcrafts/ui". Inline status. AlertDialog remains the confirm dialog.',
      },
    },
  },
  args: { tone: "info", children: "Parameters changed. Run again to refresh." },
} satisfies Meta<typeof Callout>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Info: Story = {};
export const Warning: Story = { args: { tone: "warning", children: "The box is missing. Distances use the selection." } };
export const Error: Story = { args: { tone: "error", children: "The run failed." } };
