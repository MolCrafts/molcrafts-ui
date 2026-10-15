import { ChartMultipleRegular, DocumentRegular, SettingsRegular } from "@fluentui/react-icons";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { IconTabStrip, Tabs, TabsContent } from "@molcrafts/ui";

const items = [
  { value: "files", label: "Files", icon: <DocumentRegular /> },
  { value: "plots", label: "Plots", icon: <ChartMultipleRegular /> },
  { value: "settings", label: "Settings", icon: <SettingsRegular /> },
];

const meta = {
  title: "UI/IconTabStrip",
  component: IconTabStrip,
  parameters: {
    docs: {
      description: {
        component:
          'import { IconTabStrip } from "@molcrafts/ui". Icon-only tab list inside `Tabs`; each tab keeps its name as an accessible label and tooltip.',
      },
    },
  },
  args: { items, label: "Side panel" },
  render: args => (
    <Tabs defaultValue="files">
      <IconTabStrip {...args} />
      {items.map(item => (
        <TabsContent key={item.value} value={item.value} className="p-3">
          {item.label} panel
        </TabsContent>
      ))}
    </Tabs>
  ),
} satisfies Meta<typeof IconTabStrip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
