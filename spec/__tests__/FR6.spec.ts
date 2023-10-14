/**
 * @fileoverview Repeated generation
 */

import test from "node:test";
import assert from "node:assert";
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

test("FR6: Repeated generation", () => {
  const factory = Math.random;
  const arbitrary = new Arbitrary(factory);
  const repeated = arbitrary.repeat(10);
  const sample = repeated.sample();

  assert.strictEqual(sample.length, 1);
  assert.strictEqual(sample[0].length, 10);
});
