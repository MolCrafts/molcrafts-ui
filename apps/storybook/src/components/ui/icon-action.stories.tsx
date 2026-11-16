import { SettingsRegular } from "@fluentui/react-icons";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { IconAction } from "@molcrafts/ui";

const meta = {
  title: "UI/IconAction",
  component: IconAction,
  parameters: {
    docs: {
      description: {
        component:
          'import { IconAction } from "@molcrafts/ui". Icon button with a required name and tooltip.',
      },
    },
  },
  args: { label: "Settings", icon: <SettingsRegular /> },
} satisfies Meta<typeof IconAction>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { selected: true, label: "Grid" } };
