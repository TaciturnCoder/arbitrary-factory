import { Arbitrary } from "./arbitrary.js";

declare type Factory<T> = T | ((source?: Arbitrary) => T) | Arbitrary<T>;

/**
 * Proxy handler for Mimic.
 */
const handler: ProxyHandler<Mimic<any>> = {
  get(target, key, receiver) {
    if (key in target)
      return Reflect.get(target, key, receiver);

    return target.get(key);
  }
}

/**
 * Arbitrary data generator with proxy support.
 */
export interface Mimic<T> extends Arbitrary<T> {
  // Call signature.
  (source?: Arbitrary): T;
  [key: PropertyKey]: any;

  // Proxy support.
  get<S extends Mimic<T>>(key: PropertyKey, reuse?: Boolean): S;
}

/**
 * Arbitrary data generator with proxy support.
 * Allows mimicking properties of arbitrary data.
 */
export class Mimic<T> extends Arbitrary<T> implements Mimic<T> {
  #buffer?: T;
  #refresh: Set<PropertyKey> = new Set<PropertyKey>();

  constructor(factory: Factory<T>, source?: Arbitrary) {
    super(factory, source);
    return new Proxy(this, handler);
  }

  /**
   * Mimic a property of arbitrary data.
   */
  get<S extends Mimic<T>>(key: PropertyKey): S {
    const factory = (source?: Arbitrary) => {
      if (!this.#buffer) {
        this.#buffer = this(source);
        this.#refresh.clear();
      }

      if (this.#refresh.has(key)) {
        this.#buffer = this(source);
        this.#refresh.clear();
      }

      this.#refresh.add(key);
      return (this.#buffer as any)[key];
    }
    return new (this.constructor as any)(factory) as S;
  }
}
