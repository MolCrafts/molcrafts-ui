import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<fluent-field><fluent-label slot="label">Workspace preferences</fluent-label><fluent-text-input slot="input" value="Workspace">Name</fluent-text-input></fluent-field>`;

const meta = {
  title: "Web Components/Field",
  parameters: { docs: { description: { component: "<fluent-field> from @molcrafts/design-web-components. Label and input use the label and input slots." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Field" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-field"); },
};
