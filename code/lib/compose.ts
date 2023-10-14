import { Arbitrary } from "../src/arbitrary.js";

/**
 * Compose an arbitrary string from tagged template literal
 * @param literal String literals from template expression
 * @param arbitrary Arbitrary factories for template expression
 * @returns Arbitrary string
 */
export function compose(
  literal: TemplateStringsArray,
  ...arbitrary: unknown[]): Arbitrary<string> {
  const a = arbitrary.map(x => new Arbitrary(x));

  const factory = (source?: Arbitrary) => {
    let result = literal[0];
    for (let i = 0; i < a.length; i += 1) {
      result += String(a[i](source)) + literal[i + 1];
    }
    return result;
  }

  return new Arbitrary(factory);
}
