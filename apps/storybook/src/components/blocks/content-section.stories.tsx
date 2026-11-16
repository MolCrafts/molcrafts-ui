import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Button, ContentSection } from "@molcrafts/ui";

const meta = {
  title: "Blocks/ContentSection",
  component: ContentSection,
  parameters: { layout: "padded", docs: { description: { component: 'import { ContentSection } from "@molcrafts/ui". A titled group without card chrome. The heading labels the section.' } } },
  args: { title: "History", children: <p className="text-body">One chart per record.</p> },
} satisfies Meta<typeof ContentSection>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithDescriptionAndAction: Story = {
  args: { title: "Files", description: "The ten files with the most untested lines.", action: <Button variant="link" size="content">All files</Button> },
};
