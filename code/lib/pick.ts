import { Arbitrary } from "../src/arbitrary.js";
import { Uniform } from "../src/randomizer.js";
import { Mimic } from "../src/mimic.js";

/**
 * Pool of arbitrary data.
 * A constant data, a function, or an Arbitrary.
 * @param source Source of randomness.
 * @returns Arbitrary pool.
 */
declare type Pool<T> = T[] | ((source?: Arbitrary) => T[]) | Arbitrary<T[]>;

// Functional Requirement FR8
/**
 * Pick one of the arbitrary data in the pool.
 * By default uses uniform distribution to pick.
 * @param pool Pool of arbitrary data.
 * @param seed Seed for the randomizer.
 * @returns One of the arbitrary data in the pool.
 * @remarks
 * Picking is done lazily.
 */
export function pick<T>(pool: Pool<T>, seed?: number): Arbitrary<T> {
  const p = Mimic(pool);
  const random = new Uniform(0, p.length, seed).map(Math.floor);
  // Functional Requirement FR4
  const factory = (source?: Arbitrary) => {
    const r = source as Arbitrary<number> ?? random;
    return p[r()]();
  }
  return new Arbitrary(factory);
}
