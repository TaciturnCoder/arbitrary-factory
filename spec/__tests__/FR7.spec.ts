/**
 * @fileoverview Primitive type casting
 */

import test from "node:test";
import assert from "node:assert";
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

test("FR7: Number type casting", () => {
  const factory = Math.random;
  const arbitrary = new Arbitrary(factory);
  let number: number;

  number = arbitrary();
  assert.strictEqual(typeof number, "number");

  number = arbitrary.valueOf();
  assert.strictEqual(typeof number, "number");

  number = +arbitrary;
  assert.strictEqual(typeof number, "number");

  number = arbitrary[Symbol.toPrimitive]("default") as number;
  assert.strictEqual(typeof number, "number");
});

test("FR7: String type casting", () => {
  const factory = Math.random;
  const arbitrary = new Arbitrary(factory);
  let string: string;

  string = arbitrary.toString();
  assert.strictEqual(typeof string, "string");

  string = "" + arbitrary;
  assert.strictEqual(typeof string, "string");
});
