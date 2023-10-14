import { Arbitrary } from "./arbitrary.js";

/**
 * Factory function for random number.
 * A constant number, a function, or an Arbitrary.
 * @returns Random number.
 */
declare type Factory = number | (() => number) | Arbitrary<number>;

// ------------------------------------------------------------------
// Random distribution generator.
// ------------------------------------------------------------------
/**
 * Random distribution generator.
 * Uses Math.random as default factory.
 * Generates numbers in the range [0,1).
 */
export class Randomizer extends Arbitrary<number> {
  /**
   * Construct random distribution generator.
   * @param factory Factory function for random number.
   * @returns Random distribution generator.
   */
  constructor(factory: Factory = Math.random) {
    super(factory);
  }
}

// ------------------------------------------------------------------
// Pseudo Random Number Generator (PRNG).
// ------------------------------------------------------------------
/**
 * Pseudo Random Number Generator (PRNG).
 * Uses Mulberry32 algorithm.
 * Generates numbers in the range [0,1).
 */
export class PRNG extends Randomizer {
  // Functional Requirement FR8
  /**
   * Construct PRNG.
   * @param seed Seed for PRNG.
   * @returns PRNG.
   */
  constructor(seed: number = Date.now()) {
    const factory = () => {
      seed |= 0; // Ensure seed is a 32-bit integer.
      seed += 0x6D2B79F5;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t += Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    super(factory);
  }
}

// ------------------------------------------------------------------
// Uniform distribution generator.
// ------------------------------------------------------------------
/**
 * Uniform distribution generator.
 * Generates numbers in the range [min,max).
 */
export class Uniform extends Randomizer {
  // Functional Requirement FR8
  /**
   * Construct uniform distribution generator.
   * @param min Minimum value for range.
   * @param max Maximum value for range.
   * @param seed Seed for PRNG.
   * @returns Uniform distribution generator.
   */
  constructor(min: Factory, max: Factory, seed?: number) {
    const m = new Arbitrary(min);
    const M = new Arbitrary(max);
    const prng = new PRNG(seed);
    const factory = () => {
      const x = m();
      return x + (M() - x) * prng();
    }
    super(factory);
  }
}

// ------------------------------------------------------------------
// Gaussian distribution generator.
// ------------------------------------------------------------------
/**
 * Gaussian distribution generator.
 * Uses Box-Muller transform to generate numbers.
 */
export class Gaussian extends Randomizer {
  // Functional Requirement FR8
  /**
   * Construct Gaussian distribution generator.
   * @param mean Mean value for distribution.
   * @param std Standard deviation for distribution.
   * @param seed Seed for PRNG.
   * @returns Gaussian distribution generator.
   */
  constructor(mean: Factory, std: Factory, seed?: number) {
    const m = new Arbitrary(mean);
    const s = new Arbitrary(std);
    const prng = new PRNG(seed);
    const factory = () => {
      const u = 1 - prng(); // [0,1) -> (0,1]
      const v = prng(); // [0,1)
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      return m() + s() * z;
    };
    super(factory);
  }
}
