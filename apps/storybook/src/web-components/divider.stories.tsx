import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<p>Overview</p><fluent-divider></fluent-divider><p>Details</p>`;

const meta = {
  title: "Web Components/Divider",
  parameters: { docs: { description: { component: "<fluent-divider> from @molcrafts/ui-web-components." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Divider" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-divider"); },
};
