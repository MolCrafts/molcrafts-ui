import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<div class="flex flex-wrap gap-2"><fluent-badge appearance="tint" color="success">Completed</fluent-badge><fluent-badge appearance="tint" color="danger">Failed</fluent-badge><fluent-badge appearance="tint" color="warning">Warning</fluent-badge><fluent-badge>Neutral</fluent-badge></div>`;

const meta = {
  title: "Web Components/Badge",
  parameters: { docs: { description: { component: "<fluent-badge> from @molcrafts/design-web-components. Status text stays readable." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Badge" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-badge"); },
};
