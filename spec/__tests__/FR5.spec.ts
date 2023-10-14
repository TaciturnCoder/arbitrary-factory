/**
 * @fileoverview Sampling
 */

import test from "node:test";
import assert from "node:assert";
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

test("FR5: Sampling", () => {
  const factory = Math.random;
  const arbitrary = new Arbitrary(factory);
  const sample = arbitrary.sample(10);

  assert.strictEqual(sample.length, 10);
});
