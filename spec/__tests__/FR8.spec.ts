/**
 * @fileoverview Reproducible results
 */

import test from "node:test";
import assert from "node:assert";
import { PRNG } from "@dwijbavisi/arbitrary-factory/randomizer";

test("FR8: Reproducible results", () => {
  const factory1 = new PRNG(35); // random number factory
  const factory2 = new PRNG(35); // random number factory

  const sample1 = factory1.sample(100);
  const sample2 = factory2.sample(100);

  assert.strictEqual(sample1.every((x, i) => x === sample2[i]), true);
});
