import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<fluent-tablist aria-label="Sections"><fluent-tab>Overview</fluent-tab><fluent-tab>Details</fluent-tab></fluent-tablist>`;

const meta = {
  title: "Web Components/Tablist",
  parameters: { docs: { description: { component: "<fluent-tablist> from @molcrafts/ui-web-components." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Tablist" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-tablist"); },
};
