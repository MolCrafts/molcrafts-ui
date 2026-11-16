import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePreviewMode, previewActions, previewFileName } from "../../packages/ui/dist/lib/preview.js";

const run = () => {};
const actions = [
  { kind: "menu", id: "export", label: "Export", icon: "export", group: "export", items: [] },
  { kind: "button", id: "clear", label: "Clear", icon: "clear", group: "edit", mutates: true, run },
  { kind: "button", id: "fit", label: "Reset view", icon: "reset-view", group: "view", run },
  { kind: "toggle", id: "table", label: "Data table", icon: "table", group: "inspect", pressed: false, onToggle: run },
  { kind: "button", id: "zoom-in", label: "Zoom in", icon: "zoom-in", group: "view", run },
];

test("read-only drops actions that mutate and keeps group order", () => {
  assert.deepEqual(previewActions("readonly", actions).map((a) => a.id), ["fit", "zoom-in", "table", "export"]);
  assert.deepEqual(previewActions("edit", actions).map((a) => a.id), ["clear", "fit", "zoom-in", "table", "export"]);
});

test("the mode is explicit: absent is read-only, anything else throws", () => {
  assert.equal(parsePreviewMode(null), "readonly");
  assert.equal(parsePreviewMode(" edit "), "edit");
  assert.throws(() => parsePreviewMode("view"), /Invalid preview mode "view"/);
});

test("download names carry the figure", () => {
  assert.equal(previewFileName("Junction bond lengths after minimization", "png"), "junction-bond-lengths-after-minimization.png");
  assert.equal(previewFileName("chain10.minimized.pdb", "svg"), "chain10-minimized.svg");
  assert.equal(previewFileName(undefined, ".png", "chart"), "chart.png");
});
