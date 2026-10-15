import { parse, View } from "vega";

export interface MountedVegaView {
  finalize(): void;
  runAsync(): Promise<unknown>;
}

/** Draw one already-compiled Vega spec. No React and no second theme merge. */
export function mountVegaSvg(container: HTMLElement, spec: object): MountedVegaView {
  const view = new View(parse(spec as Parameters<typeof parse>[0]), {
    renderer: "svg",
    container,
    hover: true,
  });
  return view;
}
