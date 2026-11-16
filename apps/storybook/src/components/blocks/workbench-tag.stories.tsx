import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { WorkbenchTag } from "@molcrafts/ui";

const meta = {
  title: "Blocks/WorkbenchTag",
  component: WorkbenchTag,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          'import { WorkbenchTag } from "@molcrafts/ui". Small tag whose `meaning` picks the semantic tone.',
      },
    },
  },
  args: { meaning: "category", children: "analysis" },
} satisfies Meta<typeof WorkbenchTag>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Meanings: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["category", "metadata", "selection", "completed", "failed", "warning"] as const).map(meaning => (
        <WorkbenchTag key={meaning} meaning={meaning}>
          {meaning}
        </WorkbenchTag>
      ))}
      <WorkbenchTag meaning="metadata" mono>
        n_7f3a21
      </WorkbenchTag>
    </div>
  ),
};
