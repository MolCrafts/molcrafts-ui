import assert from "node:assert/strict";
import test from "node:test";
import {
  fontScaleForHost,
  knownPreset,
  prepareChartSpec,
  schemeIsDark,
  scienceplotsConfig,
} from "../dist/scienceplots.js";

const palette = ["#0c5da5", "#00b945", "#ff9500", "#ff2c00", "#845b97", "#474747", "#9e9e9e"];

test("molplot preset is the scienceplots cycle", () => {
  const config = scienceplotsConfig("molplot", "light", 1, null);
  assert.deepEqual(config.range.category, palette);
  assert.equal(config.mark.color, "#0c5da5");
  assert.equal(config.line.strokeWidth, 1);
  assert.equal(config.axis.labelFontSize, 9);
  assert.equal(config.axis.tickColor, "#000000");
  assert.match(config.font, /Times New Roman/);
  const dark = scienceplotsConfig("molplot", "dark", 1, null);
  assert.equal(dark.axis.tickColor, "#e5e5e5");
  assert.equal(dark.background, "transparent");
});

test("paper preset keeps the tighter type scale", () => {
  const paper = scienceplotsConfig("molplot-paper", "light", 1, null);
  assert.equal(paper.axis.labelFontSize, 8);
  assert.equal(paper.point.size, 9);
  assert.deepEqual(paper.range.category, palette);
});

test("author domain, stroke, and legend win", () => {
  const author = {
    mark: { type: "line", strokeWidth: 2.4, interpolate: "monotone" },
    data: { values: [{ r: 3.725, g: 2.9589 }] },
    encoding: {
      x: { field: "r", type: "quantitative", title: "r (Å)", scale: { domain: [0, 14] } },
      y: { field: "g", type: "quantitative", title: "g(r)", scale: { domain: [0, 3.2] } },
    },
    config: { legend: { orient: "bottom", direction: "horizontal", title: null }, axis: { labelFontSize: 99 } },
  };
  const { spec } = prepareChartSpec(author, {
    preset: "molplot", width: 560, height: 350, aspectRatio: 16 / 10,
    interactive: true, mode: "light", hostFontPx: 13, ink: null,
  });
  assert.equal(spec.mark.strokeWidth, 2.4);
  assert.deepEqual(spec.encoding.x.scale.domain, [0, 14]);
  assert.deepEqual(spec.encoding.y.scale.domain, [0, 3.2]);
  assert.equal(spec.config.legend.orient, "bottom");
  assert.notEqual(spec.config.axis.labelFontSize, 99);
  assert.equal(spec.config.range.category[0], "#0c5da5");
  assert.deepEqual(spec.params.map((param) => param.name), ["zoomX", "zoomY"]);
});

test("layered specs put zoom on the first layer only", () => {
  const { spec } = prepareChartSpec({
    encoding: { x: { field: "t", type: "quantitative" }, y: { field: "msd", type: "quantitative" } },
    layer: [
      { mark: { type: "line", strokeWidth: 1.4, color: "#7a8a80" } },
      { mark: { type: "line", strokeWidth: 2.6, color: "#0c5da5" } },
    ],
  }, {
    preset: "molplot", width: 640, height: 400, aspectRatio: 16 / 10,
    interactive: true, mode: "light", hostFontPx: 13, ink: null,
  });
  assert.equal(spec.params, undefined);
  assert.deepEqual(spec.layer[0].params.map((param) => param.name), ["zoomX", "zoomY"]);
  assert.equal(spec.layer[1].params, undefined);
  assert.equal(spec.layer[1].mark.color, "#0c5da5");
  assert.equal(spec.layer[1].mark.strokeWidth, 2.6);
});

test("interactive false leaves the domain alone", () => {
  const { spec } = prepareChartSpec({
    mark: "line",
    encoding: { x: { field: "x", type: "quantitative" }, y: { field: "y", type: "quantitative" } },
  }, {
    preset: "molplot", width: 320, height: 200, aspectRatio: 16 / 10,
    interactive: false, mode: "light", hostFontPx: 13, ink: null,
  });
  assert.equal(spec.params, undefined);
});

test("theme and preset parsing", () => {
  assert.equal(knownPreset(null), "molplot");
  assert.equal(knownPreset("molplot-paper"), "molplot-paper");
  assert.equal(knownPreset("fluent"), null);
  assert.equal(schemeIsDark({ rootClassDark: false, rootScheme: null, bodyScheme: "slate", prefersDark: false }), true);
  assert.equal(schemeIsDark({ rootClassDark: false, rootScheme: "default", bodyScheme: null, prefersDark: true }), false);
  const scale = fontScaleForHost(560, 13);
  assert.ok(scale > 1.15 && scale < 1.85);
});
