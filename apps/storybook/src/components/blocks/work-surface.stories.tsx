import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { ContentSection, MetaStrip, WorkSurface } from "@molcrafts/ui";

const meta = {
  title: "Blocks/WorkSurface",
  component: WorkSurface,
  parameters: { layout: "fullscreen", docs: { description: { component: 'import { WorkSurface } from "@molcrafts/ui". The scroller every tab renders into, with one padding and gap.' } } },
  args: { children: null },
  render: () => (
    <div className="flex h-96 flex-col">
      <WorkSurface>
        <MetaStrip facts={[{ label: "Records", value: 6 }, { label: "Snapshots", value: 214 }]} />
        {Array.from({ length: 6 }, (_, i) => <ContentSection key={i} title={`Section ${i + 1}`}><p className="text-body">Content scrolls inside the surface.</p></ContentSection>)}
      </WorkSurface>
    </div>
  ),
} satisfies Meta<typeof WorkSurface>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
