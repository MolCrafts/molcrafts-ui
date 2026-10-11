import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@molcrafts/design";

const meta = {
  title: "UI/Command",
  component: Command,
  parameters: { docs: { description: { component: 'import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@molcrafts/design"' } } },
} satisfies Meta<typeof Command>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Command className="w-80 rounded-panel border">
      <CommandInput placeholder="Find a component" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>Create item</CommandItem>
          <CommandItem>Rename</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
