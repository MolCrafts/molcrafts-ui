import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent } from "storybook/test";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `<div class="flex items-center gap-2"><fluent-checkbox id="wc-check" aria-label="Notifications"></fluent-checkbox><label for="wc-check">Notifications</label></div>`;

const meta = {
  title: "Web Components/Checkbox",
  parameters: { docs: { description: { component: "<fluent-checkbox> from @molcrafts/design-web-components. Checked state is the element property." } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => <NativeCanvas label="Checkbox" markup={markup} />,
  play: async ({ canvasElement }) => {
    await expectNative(canvasElement, "fluent-checkbox");
    const check = canvasElement.querySelector("#wc-check") as HTMLElement & { checked: boolean };
    await userEvent.click(check);
    await expect(check.checked).toBe(true);
  },
};
