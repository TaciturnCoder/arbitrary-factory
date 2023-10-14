/**
 * @fileoverview Source of randomness
 */

import test from "node:test";
import { PRNG, Uniform, Gaussian } from "@dwijbavisi/arbitrary-factory/randomizer";
import { pick } from "@dwijbavisi/arbitrary-factory/lib";

test("FR4: PRNG", () => {
  const prng = new PRNG(123456789); // Seed
  for (let i = 0; i < 10; i += 1) {
    // console.log(prng.next());
    prng.next();
  }
});

test("FR4: Randomizer", () => {
  const uniform = new Uniform(0, 100); // Min, Max
  const gaussian = new Gaussian(50, 10); // Mean, Std
  // console.log(uniform.sample(10));
  // console.log(gaussian.sample(10));
  uniform.sample(10);
  gaussian.sample(10);
});

test("FR4: Randomness", () => {
  const grades = ["A", "B", "C", "D", "E", "F"]; // Grades
  const results = pick(grades).repeat(100); // 100 random grades generator

  // Uniform selection
  const uniform = new Uniform(0, 6).map(Math.floor);
  // console.log(results(uniform));
  results(uniform);

  // Gaussian selection
  const gaussian = new Gaussian(2, 1).map(Math.floor);
  // console.log(results(gaussian));
  results(gaussian);
});
