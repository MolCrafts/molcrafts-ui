import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent } from "storybook/test";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<div class="flex items-center gap-2"><fluent-switch id="wc-switch" aria-label="Auto save" checked></fluent-switch><label for="wc-switch">Auto save</label></div>`;

const meta = {
  title: "Web Components/Switch",
  parameters: { docs: { description: { component: "<fluent-switch> from @molcrafts/ui-web-components." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Switch" markup={markup} />,
  play: async ({ canvasElement }) => {
    await expectNative(canvasElement, "fluent-switch");
    const control = canvasElement.querySelector("#wc-switch") as HTMLElement & { checked: boolean };
    await expect(control.checked).toBe(true);
    await userEvent.click(control);
    await expect(control.checked).toBe(false);
  },
};
