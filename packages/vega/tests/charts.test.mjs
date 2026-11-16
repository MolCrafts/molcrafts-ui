import assert from "node:assert/strict";
import { arcSlices } from "../dist/charts.js";

const slices = arcSlices([
  { label: "Running", value: 1 },
  { label: "Completed", value: 1 },
  { label: "Empty", value: 0 },
]);

assert.equal(slices.length, 3);
assert.equal(slices[0].startAngle, -Math.PI / 2);
assert.equal(slices[0].endAngle, slices[1].startAngle);
assert.equal(slices[0].endAngle, Math.PI / 2);
assert.equal(slices[2].endAngle - slices[2].startAngle, 0);
assert.ok(Math.abs(slices[1].endAngle - slices[0].startAngle - Math.PI * 2) < 1e-9);
console.log("arc slices ok");
