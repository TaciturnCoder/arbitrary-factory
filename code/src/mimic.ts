import { Arbitrary } from "./arbitrary.js";

/**
 * Key for accessing properties of JavaScript objects.
 */
declare type Key = PropertyKey;

/**
 * Factory function for arbitrary data.
 * A constant data, a function, or an Arbitrary.
 * @param source Source of randomness.
 * @returns Arbitrary data.
 */
declare type Factory<T> = T | ((source?: Arbitrary) => T) | Arbitrary<T>;

/**
 * Check if factory is a constant data.
 * @param factory Factory function for arbitrary data.
 * @returns False if factory is a function or an Arbitrary, true otherwise.
 */
function isConst<T>(factory: Factory<T>): factory is T {
  return !(factory instanceof Arbitrary || factory instanceof Function);
}

// ------------------------------------------------------------------
// Interface for Mimicry.
// ------------------------------------------------------------------
/**
 * Non-registered symbol for disabling mimicry.
 */
export const NoMimic = Symbol("NoMimic");

/**
 * Type of object that can be mimicked.
 */
export declare type Mimicable = { [key: Key]: any }

/**
 * Type of object that has been mimicked.
 */
export declare type Mimicked<T> = {
  /**
   * Properties of object that has been mimicked.
   * @remarks
   * Properties are lazy evaluated.
   */
  [K in keyof T]: Mimicry<T[K]>
} & {
  /**
   * Disable mimicry.
   */
  [NoMimic]: Arbitrary<T>
} & Arbitrary<T>;

/**
 * Type of proxyfied object that has been mimicked.
 */
export declare type Mimicry<T> = T extends Mimicable ? Mimicked<T> : Arbitrary<T>;

// ------------------------------------------------------------------
// Mimicry.
// ------------------------------------------------------------------
/**
 * Arbitrary data generator with support for mimicking properties of data.
 * Usefull for handling data with complex structures.
 * @param factory Factory function for arbitrary data.
 * @param sample Sample data for safely initializing mimicry.
 * @returns Proxyfied arbitrary data generator.
 * @remarks
 * Mimicry is lazy evaluated. Typescript cannot infer dynamic properties.
 */
export function Mimic<T extends Mimicable>
  (factory: Factory<T>, sample?: T): Mimicked<T> {

  // Prevent redundant mimicry.
  if (factory instanceof Arbitrary && NoMimic in factory) return factory as Mimicked<T>;

  /**
   * Buffer for storing last generated data.
   * @remarks
   * This allows for evluating properties on same data object.
   */
  let buffer: T;

  /**
   * Set of properties that have been evaluated.
   * @remarks
   * This allows for evaluating properties only once.
   */
  const refresh = new Set<Key>();

  /**
   * Cache for resuing arbitrary generators
   */
  const cache = new Map<Key, Mimicry<unknown>>();

  /**
   * Generate arbitrary data.
   * @param source Source of randomness.
   * @returns Arbitrary data.
   */
  const f = (source?: Arbitrary) => {
    buffer = isConst(factory) ? factory : factory(source);
    refresh.clear();
    return buffer;
  };

  /**
   * Arbitrary data generator.
   * @remarks
   * This is the actual generator.
   */
  const arbitrary = new Arbitrary(f);

  // Initialize buffer.
  if (sample) buffer = sample
  else arbitrary();

  /**
   * Get property of arbitrary data.
   * @param key Property key.
   * @returns Property value.
   * @remarks
   * Ensure that property is evaluated only once.
   */
  function get<U>(key: Key): U {
    if (refresh.has(key)) {
      arbitrary();
    }
    refresh.add(key);
    return buffer[key];
  }

  /**
   * Proxyfied property of arbitrary data.
   * @param key Proxyfied property key.
   * @returns Proxyfied property value.
   * @remarks
   * Proxyfied property is lazy evaluated.
   */
  function proxy<U>(key: Key): Mimicry<U> {
    // Reuse cached arbitrary generator.
    if (cache.has(key)) return cache.get(key) as Mimicry<U>;

    // Get sample property value.
    const data: U = buffer[key];
    let m: Mimicry<U>;

    if (data instanceof Object && data !== null) {
      // Allow recursive mimicry for complex data structures.
      m = Mimic(() => get<U>(key), data) as Mimicry<U>;
    } else {
      // Property value is not an object, cannot be mimicked further.
      m = new Arbitrary(() => get<U>(key)) as Mimicry<U>;
    }

    // Cache arbitrary generator.
    cache.set(key, m);
    return m;
  }

  // Return proxyfied arbitrary data generator.
  return new Proxy(arbitrary, {
    has: (_, key: Key) => (key === NoMimic || key in buffer),
    get: (_, key: Key) => (key === NoMimic) ? arbitrary : proxy(key),
  }) as Mimicked<T>;
}
