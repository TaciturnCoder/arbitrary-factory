/**
 * @fileoverview Stream manipulation
 */

import test from "node:test";
import assert from "node:assert";
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

test("FR2: Stream manipulation", () => {
  const factory = Math.random;
  const arbitrary = new Arbitrary(factory);
  const graph = arbitrary.map(x => [x, x ** 2]);
  const result = graph();

  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0] ** 2, result[1]);
});
