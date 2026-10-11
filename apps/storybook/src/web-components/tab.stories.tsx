import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<fluent-tablist aria-label="Sections"><fluent-tab>Overview</fluent-tab><fluent-tab>Details</fluent-tab></fluent-tablist>`;

const meta = {
  title: "Web Components/Tab",
  parameters: { docs: { description: { component: "<fluent-tab> from @molcrafts/ui-web-components. A tab is used inside fluent-tablist." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Tab" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-tab"); },
};
