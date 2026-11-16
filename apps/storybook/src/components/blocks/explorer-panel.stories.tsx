import { AddRegular } from "@fluentui/react-icons";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Button, ExplorerPanel, NavList, NavListItem } from "@molcrafts/ui";

const meta = {
  title: "Blocks/ExplorerPanel",
  component: ExplorerPanel,
  parameters: { layout: "fullscreen", docs: { description: { component: 'import { ExplorerPanel } from "@molcrafts/ui". A titled, scrollable navigator column. Place it in a labelled nav region.' } } },
  args: {
    title: "Projects",
    children: <NavList>{["molcrafts-ci", "molrs", "molpy"].map((id, i) => <NavListItem key={id} current={i === 0}>{id}</NavListItem>)}</NavList>,
  },
  render: args => <nav aria-label="Projects" className="flex h-96 w-64 border-r border-border bg-surface"><ExplorerPanel {...args} /></nav>,
} satisfies Meta<typeof ExplorerPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithActions: Story = { args: { actions: <Button variant="ghost" size="icon" aria-label="Add project" title="Add project"><AddRegular /></Button> } };
