import { Arbitrary } from "./src/arbitrary.js";
import { Mimic } from "./src/mimic.js";
import { Randomizer, UniformRandomizer } from "./src/randomizer.js";

/**
 * Pick an arbitrary value from a pool.
 */
export function pick<T>(pool: T[] | Arbitrary<T[]>): Arbitrary<T> {
  const a = new Arbitrary<T[]>(pool);
  let random: Randomizer;

  const factory = (source?: Arbitrary) => {
    const p = a();
    if (!source && !random) {
      random = new UniformRandomizer(0, p.length).map(Math.floor);
    }

    return p[random(source ?? random)];
  };

  return new Arbitrary<T>(factory);
}

/**
 * Take arbitrary values from a pool without repetition.
 */
export function take<T>(count: number, pool: T[] | Arbitrary<T[]>): Mimic<T[]> {
  const a = new Arbitrary<T[]>(pool);
  let random: Randomizer;

  const factory = (source?: Arbitrary) => {
    const p = a();
    if (!source && !random) {
      random = new UniformRandomizer(0, p.length).map(Math.floor);
    }

    const taken = new Set<number>();
    const result: T[] = [];
    const max = Math.min(count, p.length);
    while (result.length < max) {
      const i = random(source ?? random);
      if (!taken.has(i)) {
        taken.add(i);
        result.push(p[i]);
      }
    }

    return result;
  };

  return new Mimic<T[]>(factory);
}

/**
 * Shuffle a pool of arbitrary values.
 */
export function shuffle<T>(pool: T[] | Arbitrary<T[]>): Mimic<T[]> {
  const a = new Arbitrary<T[]>(pool);
  let random: Randomizer;

  const factory = (source?: Arbitrary) => {
    const p = a();
    if (!source && !random) {
      random = new UniformRandomizer(0, p.length).map(Math.floor);
    }

    const result = p.slice();
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = random(source ?? random);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  };

  return new Mimic<T[]>(factory);
}

/**
 * Compose arbitrary string using tagged template literals.
 */
export function compose(
  literal: TemplateStringsArray,
  ...arbitrary: any[]): Arbitrary<string> {
  const a = arbitrary.map(x => new Arbitrary(x));

  const factory = (source?: Arbitrary) => {
    let result = literal[0];
    for (let i = 0; i < a.length; i += 1) {
      result += String(a[i](source)) + literal[i + 1];
    }
    return result;
  }

  return new Arbitrary<string>(factory);
}
