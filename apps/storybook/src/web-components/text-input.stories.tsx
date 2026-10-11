import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<fluent-text-input value="Workspace">Name</fluent-text-input>`;

const meta = {
  title: "Web Components/TextInput",
  parameters: { docs: { description: { component: "<fluent-text-input> from @molcrafts/design-web-components. The default slot is the accessible name." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Text input" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-text-input"); },
};
