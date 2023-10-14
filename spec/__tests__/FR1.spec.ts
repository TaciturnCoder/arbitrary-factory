/**
 * @fileoverview Callable, Iterable, Iterator
 */

import test from "node:test";
import assert from "node:assert";
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

test("FR1: Callable", () => {
  const factory = 10;
  const arbitrary = new Arbitrary(factory);
  assert.strictEqual(typeof arbitrary(), "number");
});

test("FR1: Iterable", () => {
  const factory = Math.random;
  const arbitrary = new Arbitrary(factory);
  for (const value of arbitrary) {
    assert.strictEqual(typeof value, "number");
    break;
  }
});

test("FR1: Iterator", () => {
  const random = Math.random;
  const factory = new Arbitrary(random);
  const arbitrary = new Arbitrary(factory, factory);
  assert.strictEqual(typeof arbitrary.next().value, "number");
});
