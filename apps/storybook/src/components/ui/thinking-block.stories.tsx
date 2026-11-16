import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ThinkingBlock } from "@molcrafts/ui";

const meta = {
  title: "UI/ThinkingBlock",
  component: ThinkingBlock,
  parameters: {
    docs: {
      description: {
        component:
          'import { ThinkingBlock } from "@molcrafts/ui". Collapsible assistant reasoning; renders nothing when `thinking` is empty.',
      },
    },
  },
  args: {
    thinking: "The trajectory has 2,000 frames. The RDF needs only the last 500, so slice before computing.",
  },
} satisfies Meta<typeof ThinkingBlock>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Streaming: Story = { args: { streaming: true } };
