import { useState } from "react";
import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { NavList, NavListItem } from "@molcrafts/ui";

function Projects() {
  const [current, setCurrent] = useState("molcrafts-ci");
  return (
    <nav aria-label="Projects" className="w-64">
      <NavList>
        {["molcrafts-ci", "molrs", "molpy", "molvis-plugin-template-with-a-long-name"].map(id => (
          <NavListItem key={id} current={id === current} onClick={() => setCurrent(id)}>{id}</NavListItem>
        ))}
      </NavList>
    </nav>
  );
}

const meta = {
  title: "UI/NavList",
  component: NavList,
  parameters: { docs: { description: { component: 'import { NavList, NavListItem } from "@molcrafts/ui". Flat navigation targets inside a labelled nav. current sets aria-current="page". Items are 44px touch targets.' } } },
  render: () => <Projects />,
} satisfies Meta<typeof NavList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
