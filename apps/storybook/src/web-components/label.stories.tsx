import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<fluent-label>Workspace name</fluent-label>`;

const meta = {
  title: "Web Components/Label",
  parameters: { docs: { description: { component: "<fluent-label> from @molcrafts/design-web-components. Visual label styling; it is not a native label element." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Label" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-label"); },
};
