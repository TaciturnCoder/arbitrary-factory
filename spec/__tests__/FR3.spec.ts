/**
 * @fileoverview Stream filtering
 */

import test from "node:test";
import assert from "node:assert";
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

test("FR3: Stream filtering", () => {
  const factory = Math.random;
  const arbitrary = (new Arbitrary(factory)).map(x => x * 100).map(Math.floor);
  const even = arbitrary.filter(x => x % 2 === 0);
  const result = even.sample(100);

  assert.strictEqual(result.length, 100);
  assert.strictEqual(result.every(x => x % 2 === 0), true);
});
