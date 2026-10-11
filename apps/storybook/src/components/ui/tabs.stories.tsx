import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@molcrafts/design";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: { docs: { description: { component: 'import { Tabs, TabsContent, TabsList, TabsTrigger } from "@molcrafts/design"' } } },
  args: { defaultValue: "overview" },
  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger><TabsTrigger value="disabled" disabled>Disabled</TabsTrigger></TabsList>
      <TabsContent value="overview" className="p-3 text-body">Overview content</TabsContent>
      <TabsContent value="settings" className="p-3 text-body">Settings content</TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
