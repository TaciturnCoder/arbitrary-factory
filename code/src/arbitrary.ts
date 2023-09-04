declare type Factory<T> = T | ((source?: Arbitrary) => T) | Arbitrary<T>;

/**
 * Arbitrary data generator.
 */
export interface Arbitrary<T = any>
  extends Function, Iterable<T>, Iterator<T> {
  // Call signature.
  (source?: Arbitrary): T;
  [Symbol.iterator](): Iterator<T>;
  next(): IteratorYieldResult<T>;

  // Stream operations.
  map<U, S extends Arbitrary<U>>(transform: (arbitrary: T) => U): S;
  filter<S extends Arbitrary<T>>(predicate: (arbitrary: T) => boolean): S;

  // Sampling methods.
  sample(count?: number): T[];
  repeat<S extends Arbitrary<T[]>>(times: number): S;

  // Presentation.
  toString(): string;
  valueOf(): number;
  // [Symbol.toStringTag](): string;
  [Symbol.toPrimitive](hint: string): T | string | number;
}

/**
 * Arbitrary data generator.
 * Uses a factory function to generate arbitrary data.
 * Factory function may accept a source of randomness.
 */
export class Arbitrary<T> implements Arbitrary<T> {
  constructor(factory: Factory<T>, source?: Arbitrary) {
    let f: Factory<T> = factory;
    if (!(factory instanceof Arbitrary || factory instanceof Function)) {
      f = () => factory;
    } else {
      if (source) {
        f = (s?: Arbitrary) => factory(s ?? source);
      }
    }
    return Object.setPrototypeOf(f, new.target.prototype);
  }

  // Generate stream of arbitrary data.
  public *[Symbol.iterator](): Iterator<T> {
    while (true) yield this();
  }

  // Generate stream of arbitrary data.
  public next(): IteratorYieldResult<T> {
    return { done: false, value: this() };
  }

  // Manipulate stream of arbitrary data.
  public map<U, S extends Arbitrary<U>>(transform: (arbitrary: T) => U): S {
    const factory = (source?: Arbitrary) => transform(this(source));
    return new Arbitrary(factory) as S;
  }

  // Filter stream of arbitrary data.
  public filter<S extends Arbitrary<T>>(predicate: (arbitrary: T) => boolean): S {
    const factory = (source?: Arbitrary) => {
      let arbitrary: T;
      do {
        arbitrary = this(source);
      } while (!predicate(arbitrary));
      return arbitrary;
    };
    return new Arbitrary(factory) as S;
  }

  // Generate multiple arbitrary data in a single call.
  public sample(count: number = 1): T[] {
    return Array.from({ length: count }, () => this());
  }

  // Repeat arbitrary data generation.
  public repeat<S extends Arbitrary<T[]>>(times: number): S {
    return new Arbitrary(() => this.sample(times)) as S;
  }

  // String representation.
  public toString(): string {
    return `${this()}`;
  }

  // Numeric representation (not recommended unless T is a number).
  public valueOf(): number {
    return Number(this());
  }

  // String representation.
  public get [Symbol.toStringTag](): string {
    return this.toString();
  }

  // Modern type conversion.
  public [Symbol.toPrimitive](hint: string): T | string | number {
    if (hint === "string") return this.toString();
    if (hint === "number") return this.valueOf();
    return this(); // hint === "default"
  }
}
