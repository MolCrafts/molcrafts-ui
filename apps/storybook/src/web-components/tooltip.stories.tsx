import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { fluentIcons } from "@molcrafts/ui-web-components";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<fluent-button id="wc-tip" appearance="primary" icon-only aria-label="Add item" type="button">${fluentIcons.add}</fluent-button><fluent-tooltip anchor="wc-tip" delay="0">Add item</fluent-tooltip>`;

const meta = {
  title: "Web Components/Tooltip",
  parameters: { docs: { description: { component: "<fluent-tooltip anchor> from @molcrafts/ui-web-components. The anchor id matches the control." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Tooltip" markup={markup} />,
  play: async ({ canvasElement }) => { await expectNative(canvasElement, "fluent-tooltip"); },
};
