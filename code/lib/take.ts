import { Arbitrary } from "../src/arbitrary.js";
import { Uniform } from "../src/randomizer.js";
import { Mimic, Mimicked } from "../src/mimic.js";

/**
 * Factory function for random number.
 * A constant number, a function, or an Arbitrary.
 * @returns Random number.
 */
declare type Factory = number | (() => number) | Arbitrary<number>;

/**
 * Pool of arbitrary data.
 * A constant data, a function, or an Arbitrary.
 * @param source Source of randomness.
 * @returns Arbitrary pool.
 */
declare type Pool<T> = T[] | ((source?: Arbitrary) => T[]) | Arbitrary<T[]>;

// Functional Requirement FR8, FR9
/**
 * Take arbitrary data from the pool without replacement.
 * @param count Number of arbitrary data to take.
 * @param pool Pool of arbitrary data.
 * @param seed Seed for the randomizer.
 * @returns Arbitrary data taken from the pool.
 * @remarks
 * Taking is done lazily.
 */
export function take<T>(count: Factory, pool: Pool<T>, seed?: number): Mimicked<T[]> {
  const c = new Arbitrary(count);
  const p = Mimic(pool);
  const random = new Uniform(0, p.length, seed).map(Math.floor);
  // Functional Requirement FR4
  const factory = (source?: Arbitrary) => {
    const r = source as Arbitrary<number> ?? random;
    const n = c();
    const result: T[] = [];
    const taken = new Set<number>();

    for (let i = 0; i < n; i += 1) {
      let index: number;
      do {
        index = r();
      } while (taken.has(index));
      taken.add(index);
      result.push(p[index]());
    }

    return result;
  }
  return Mimic(factory);
}
