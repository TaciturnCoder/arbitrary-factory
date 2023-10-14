/**
 * Factory function for arbitrary data.
 * A constant data, a function, or an Arbitrary.
 * @param source Source of randomness.
 * @returns Arbitrary data.
 * @typeParam T Type of arbitrary data.
 */
declare type Factory<T> = T | ((source?: Arbitrary) => T) | Arbitrary<T>;

/**
 * Check if factory is a constant data.
 * @param factory Factory function for arbitrary data.
 * @returns False if factory is a function or an Arbitrary, true otherwise.
 * @typeParam T Type of arbitrary data.
 */
function isConst<T>(factory: Factory<T>): factory is T {
  return !(factory instanceof Arbitrary || factory instanceof Function);
}

// ------------------------------------------------------------------
// Interface for Arbitrary data generator.
// ------------------------------------------------------------------
export interface Arbitrary<T = unknown> extends Iterator<T>, Iterable<T> {
  /**
   * Arbitrary is callable.
   * @param source Source of randomness.
   * @returns Arbitrary data.
   */
  (source?: Arbitrary): T;

  /**
   * Generate stream of arbitrary data.
   * @returns Next arbitrary data in stream.
   */
  next(): IteratorYieldResult<T>;

  /**
   * Generate stream of arbitrary data.
   * @returns Generator for accessing stream of arbitrary data.
   */
  [Symbol.iterator](): Iterator<T>;

  /**
   * Transform stream of arbitrary data.
   * @param transform Function to transform arbitrary data.
   * @returns Arbitrary data generator.
   * @typeParam U Type of transformed arbitrary data.
   * 
   * @remarks
   * Transform function is evaluated lazily.
   */
  map<U>(transform: (arbitrary: T) => U): Arbitrary<U>;

  /**
   * Filter stream of arbitrary data.
   * @param predicate Function to filter arbitrary data.
   * @returns Arbitrary data generator.
   * 
   * @remarks
   * Filter function is evaluated lazily.
   * Strict filters may cause long running time.
   */
  filter(predicate: (arbitrary: T) => boolean): Arbitrary<T>;

  /**
   * Generate a sample of arbitrary data.
   * @param count Number of samples to generate.
   * @param source Source of randomness.
   * @returns Array of arbitrary data.
   * 
   * @remarks
   * Sample is generated eagerly.
   */
  sample(count?: Factory<number>, source?: Arbitrary): T[];

  /**
   * Generate a sample of arbitrary data, but lazily.
   * @param times Number of times to repeat arbitrary generator.
   * @returns Arbitrary data generator.
   * 
   * @remarks
   * Sample is generated lazily.
   */
  repeat(times: Factory<number>): Arbitrary<T[]>;

  /**
   * Type casting support for string format.
   * @returns String representation of arbitrary data.
   */
  toString(): string;

  /**
   * Type casting support for number format.
   * @returns Number representation of arbitrary data.
   */
  valueOf(): number;

  /**
   * Type casting support for specified format.
   * @param hint Type casting hint.
   * @returns Arbitrary data in specified format.
   */
  [Symbol.toPrimitive](hint: string): T | string | number;
}

// ------------------------------------------------------------------
// Arbitrary data generator.
// ------------------------------------------------------------------
/**
 * Arbitrary data generator.
 * Requires a factory function for arbitrary data.
 * Factory function may accept a source of randomness.
 * @typeParam T Type of arbitrary data.
 */
export class Arbitrary<T> implements Arbitrary<T> {
  // Functional Requirement FR1, FR4
  /**
   * Create arbitrary data generator.
   * @param factory Factory function for arbitrary data.
   * @param source Source of randomness.
   * @returns Arbitrary data generator.
   */
  constructor(factory: Factory<T>, source?: Arbitrary) {
    // Assume factory is callable.
    let f: (source?: Arbitrary) => T;

    if (isConst(factory)) {
      // Fallback to constant factory.
      // Clone factory to prevent side effects.
      f = () => structuredClone(factory);
    } else if (source) {
      // Bind source of randomness to factory.
      f = (s?: Arbitrary) => factory(s ?? source);
    } else {
      // Assumtion holds...
      f = factory;
    }
    return Object.setPrototypeOf(f, new.target.prototype);
  }

  // Functional Requirement FR1
  public next(): IteratorYieldResult<T> {
    return { done: false, value: this() };
  }

  // Functional Requirement FR1
  public *[Symbol.iterator](): Iterator<T> {
    while (true) yield this();
  }

  // Functional Requirement FR2, FR4
  public map<U>(transform: (arbitrary: T) => U): Arbitrary<U> {
    const factory = (source?: Arbitrary) => transform(this(source));
    return new Arbitrary(factory);
  }

  // Functional Requirement FR3, FR4
  public filter(predicate: (arbitrary: T) => boolean): Arbitrary<T> {
    const factory = (source?: Arbitrary) => {
      let arbitrary: T;
      do {
        arbitrary = this(source);
      } while (!predicate(arbitrary));
      return arbitrary;
    };
    return new Arbitrary(factory);
  }

  // Functional Requirement FR4, FR5
  public sample(count: Factory<number> = 1, source?: Arbitrary): T[] {
    const c = (isConst(count)) ? count : count();
    return Array.from({ length: c }, () => this(source));
  }

  // Functional Requirement FR4, FR6
  public repeat(times: Factory<number>): Arbitrary<T[]> {
    return new Arbitrary((source?: Arbitrary) => this.sample(times, source));
  }

  // Functional Requirement FR7
  public toString(): string {
    return String(this());
  }

  // Functional Requirement FR7
  public valueOf(): number {
    return Number(this());
  }

  // Functional Requirement FR7
  public [Symbol.toPrimitive](hint: string): T | string | number {
    if (hint === "string") return String(this());
    if (hint === "number") return Number(this());
    return this(); // hint === "default"
  }
}
