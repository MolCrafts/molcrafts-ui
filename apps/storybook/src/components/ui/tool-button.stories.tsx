import { CursorRegular, RulerRegular } from "@fluentui/react-icons";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ToolButton } from "@molcrafts/ui";

const meta = {
  title: "UI/ToolButton",
  component: ToolButton,
  parameters: {
    docs: {
      description: {
        component:
          'import { ToolButton } from "@molcrafts/ui". Icon tool with a required name, tooltip and pressed state for tool palettes.',
      },
    },
  },
  args: { label: "Select", children: <CursorRegular /> },
} satisfies Meta<typeof ToolButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const WithTooltip: Story = { args: { label: "Measure", tooltip: "Measure distance (M)", children: <RulerRegular /> } };
