import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<fluent-textarea><span slot="label">Notes</span>Shared UI</fluent-textarea>`;

const meta = {
  title: "Web Components/TextArea",
  parameters: { docs: { description: { component: "<fluent-textarea> from @molcrafts/design-web-components. Label uses slot=\"label\"; initial text is the default slot." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Text area" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-textarea"); },
};
