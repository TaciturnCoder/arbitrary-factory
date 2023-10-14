import { Arbitrary } from "../src/arbitrary.js";
import { Uniform } from "../src/randomizer.js";
import { Mimic, Mimicked } from "../src/mimic.js";

/**
 * Pool of arbitrary data.
 * A constant data, a function, or an Arbitrary.
 * @param source Source of randomness.
 * @returns Arbitrary pool.
 */
declare type Pool<T> = T[] | ((source?: Arbitrary) => T[]) | Arbitrary<T[]>;

// Functional Requirement FR8, FR9
/**
 * Shuffle arbitrary data in the pool.
 * @param pool Pool of arbitrary data.
 * @param seed Seed for the randomizer.
 * @returns Pool data but shuffled.
 * @remarks
 * Shuffling is done lazily.
 */
export function shuffle<T>(pool: Pool<T>, seed?: number): Mimicked<T[]> {
  const p = Mimic(pool);
  const random = new Uniform(0, p.length, seed).map(Math.floor);
  // Functional Requirement FR4
  const factory = (source?: Arbitrary) => {
    const r = source as Arbitrary<number> ?? random;
    const result = p();
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = r();
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  return Mimic(factory);
}
