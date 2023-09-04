import { Arbitrary } from "./arbitrary.js";

/**
 * Random distribution generator.
 */
export interface Randomizer extends Arbitrary<number> {
  // Call signature.
  (): number;
}

/**
 * Random distribution generator.
 * Uses a random function to generate random numbers.
 */
export class Randomizer extends Arbitrary<number> implements Randomizer {
  constructor(random: () => number) {
    super(random);
  }
}

/**
 * Native random distribution generator.
 * Uses Math.random to generate random numbers.
 * Always returns values in the range [0,1).
 */
export class NativeRandomizer extends Randomizer {
  constructor() {
    super(Math.random);
  }
}

/**
 * Uniform random distribution generator.
 */
export class UniformRandomizer extends Randomizer {
  constructor(min: number, max: number) {
    const diff = max - min;
    const random = () => {
      return min + Math.random() * diff;
    };
    super(random);
  }
}

/**
 * Gaussian random distribution generator.
 * Uses Box-Muller transform to generate random numbers.
 */
export class GaussianRandomizer extends Randomizer {
  constructor(mean: number, std: number) {
    const random = () => {
      const u = 1 - Math.random(); // [0,1) -> (0,1]
      const v = Math.random();
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      return mean + std * z;
    };
    super(random);
  }
}

/**
 * Exponential random distribution generator.
 * Uses inverse transform sampling to generate random numbers.
 */
export class ExponentialRandomizer extends Randomizer {
  constructor(lambda: number) {
    const random = () => {
      const u = 1 - Math.random(); // [0,1) -> (0,1]
      return -Math.log(u) / lambda;
    };
    super(random);
  }
}
