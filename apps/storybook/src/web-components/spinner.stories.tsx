import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<div class="flex items-center gap-2"><fluent-spinner aria-label="Loading"></fluent-spinner><span>Loading</span></div>`;

const meta = {
  title: "Web Components/Spinner",
  parameters: { docs: { description: { component: "<fluent-spinner> from @molcrafts/ui-web-components." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Spinner" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-spinner"); },
};
