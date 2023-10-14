/**
 * @fileoverview Mimic properties of the data type
 */

import test from "node:test";
import assert from "node:assert";
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";
import { Mimic, NoMimic } from "@dwijbavisi/arbitrary-factory/mimic";

test("FR9: Mimic properties of the data type", () => {
  const complex = {
    obj: {
      arr: [1, 2, 3],
    },
    starr: ['a', 'b', 'c']
  }

  const mimic = Mimic(complex);

  assert.strictEqual(Reflect.has(mimic.obj, 'arr'), true);
  assert.strictEqual(typeof mimic.obj(), "object");
  assert.strictEqual(mimic.obj.arr[1](), 2);
  assert.strictEqual(mimic.starr[0](), 'a');
  assert.strictEqual((mimic.obj.arr.length as unknown as Arbitrary<number>)(), 3);

  const nomimic = mimic[NoMimic];
  assert.strictEqual(Reflect.has(nomimic, 'obj'), false);
});
