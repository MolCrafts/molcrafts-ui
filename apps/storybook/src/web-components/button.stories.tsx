import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { expect, userEvent } from "storybook/test";
import { fluentIcons } from "@molcrafts/design-web-components";
import { expectNative, NativeCanvas } from "./native-canvas";

const markup = `
  <div class="flex flex-wrap items-center gap-2">
    <fluent-button id="wc-add" appearance="primary" icon-only aria-label="Add item" type="button">${fluentIcons.add}</fluent-button>
    <fluent-button appearance="primary" type="button">Save changes</fluent-button>
    <fluent-button type="button">Cancel</fluent-button>
    <fluent-button disabled aria-disabled="true" type="button">Disabled</fluent-button>
  </div>
  <output id="wc-count" aria-live="polite">0 items added</output>`;

const meta = {
  title: "Web Components/Button",
  parameters: { docs: { description: { component: "import { registerMolcraftsComponents } from \"@molcrafts/design-web-components\" — <fluent-button>" } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function bindAdd(node: HTMLElement) {
  let count = 0;
  const button = node.querySelector("#wc-add");
  const increment = () => {
    count += 1;
    const output = node.querySelector("#wc-count");
    if (output) output.textContent = count === 1 ? "1 item added" : `${count} items added`;
  };
  button?.addEventListener("click", increment);
  return () => button?.removeEventListener("click", increment);
}

export const Default: Story = {
  render: () => <NativeCanvas label="Button" markup={markup} onReady={bindAdd} />,
  play: async ({ canvasElement }) => {
    await expectNative(canvasElement, "fluent-button");
    const count = canvasElement.querySelector("#wc-count")!;
    await userEvent.click(canvasElement.querySelector("#wc-add")!);
    await expect(count).toHaveTextContent("1 item added");
  },
};
