import assert from "node:assert/strict";
import test from "node:test";
import { prepareChartSpec } from "@molcrafts/ui-vega/preset";
import { compile } from "vega-lite";

// A g(r)-shaped curve. The test checks that the docs figure options survive
// compilation; it does not depend on any sibling repository's data.
const values = Array.from({ length: 141 }, (_, i) => {
  const r = i / 10;
  return { r, g: r < 3 ? 0 : 1 + 1.9 * Math.exp(-((r - 3.7) ** 2) / 0.08) };
});

test("a docs g(r) figure compiles with its domain and stroke", () => {
  const { spec } = prepareChartSpec({
    data: { values },
    mark: { type: "line", strokeWidth: 2.4, interpolate: "monotone" },
    encoding: {
      x: { field: "r", type: "quantitative", title: "r (Å)", scale: { domain: [0, 14] } },
      y: { field: "g", type: "quantitative", title: "g(r)", scale: { domain: [0, 3.2] } },
    },
  }, {
    preset: "molplot", width: 640, height: 400, aspectRatio: 16 / 10,
    interactive: true, mode: "light", hostFontPx: 13, ink: null,
  });
  const compiled = compile(spec).spec;
  const scales = compiled.scales ?? [];
  assert.deepEqual(scales.find((scale) => scale.name === "x").domain, [0, 14]);
  assert.deepEqual(scales.find((scale) => scale.name === "y").domain, [0, 3.2]);
  const mark = JSON.stringify(compiled.marks);
  assert.match(mark, /2\.4/);
  assert.match(mark, /#0c5da5/i);
});
