import { Description, Stories, Title } from "@storybook/addon-docs/blocks";
import { FIGURE_HEIGHT, FIGURE_WIDTH } from "../figures/acs";

/** A plot-type page shows the figures only. Title, caption, and status examples live on Charts/VegaView. */
function GalleryPage() {
  return <>
    <Title />
    <Description />
    <Stories title="" includePrimary />
  </>;
}

export const galleryArgs = { labelHidden: true, width: FIGURE_WIDTH, height: FIGURE_HEIGHT };

export const galleryParameters = {
  layout: "centered",
  controls: { disable: true },
  actions: { disable: true },
  docs: { page: GalleryPage },
};
