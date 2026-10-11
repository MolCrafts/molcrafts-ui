import type { Meta, StoryObj } from "storybook-react-rsbuild";
import { VegaView } from "@molcrafts/design-vega";
import { contour, contourf, imshow, pcolormesh, quiver } from "../figures/gridded";
import { galleryArgs, galleryParameters } from "./gallery";

const meta = {
  title: "Charts/Plot types/Gridded data",
  component: VegaView,
  args: { ...galleryArgs, label: "Potential on a regular grid", spec: imshow },
  parameters: {
    ...galleryParameters,
    docs: { ...galleryParameters.docs, description: { component: "Plots of arrays and fields. Regularly spaced x and y share one sequential ramp from the surface to the primary color. ACS single column, 3.33 in." } },
  },
} satisfies Meta<typeof VegaView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Imshow: Story = { name: "imshow(Z)" };
export const Pcolormesh: Story = { name: "pcolormesh(X, Y, Z)", args: { label: "Potential on a non-uniform grid", spec: pcolormesh } };
export const Contour: Story = { name: "contour(X, Y, Z)", args: { label: "Potential isolines", spec: contour } };
export const Contourf: Story = { name: "contourf(X, Y, Z)", args: { label: "Filled potential contours", spec: contourf } };
export const Quiver: Story = { name: "quiver(X, Y, U, V)", args: { label: "Rotational flow field", spec: quiver } };
