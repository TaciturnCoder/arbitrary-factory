# Software Requirements Specification for Arbitrary Factory

| Version | Date               | Author(s)      |
| ------- | ------------------ | -------------- |
| 1.0.1   | 14th October, 2023 | Taciturn Coder |

# Introduction
This section provides an overview of the entire document. It describes the purpose of the document, scope of the document and intended audience.

## Purpose
The purpose of this document is to provide a detailed description of the library. It explains the interface requirements, functional requirements, performance requirements, system design, architectural constraints and testing instructions.

It also provides a project management plan and a revision history.

## Scope
The scope of this document is to provide an in-depth description of the library. Use Cases and examples are provided to illustrate the use of the library. But it is not to be used as a tutorial for the library. It is assumed that the reader has a basic understanding of the TypeScript programming language and JavaScript runtimes.

## Intended Audience
This document is intended to be read by the developers of the library to understand the requirements of the library. It is also intended to be refered by the testers while designing the test cases for the library. Users of the library and anyone interested in the library can also refer to this document to understand the library.

# Interface Requirements
This section describes the requirements, constraints and assumptions of the interfaces of the library, including the software interface, hardware interface and communication interface.

## Software Interfaces
The library is written in TypeScript programming language. The source code is made available as a git repository published on GitHub. A TypeScript compiler is required to compile the source code into JavaScript, which can then be executed on a JavaScript runtime. It is recommended to use the latest stable version of the TypeScript compiler and the latest stable veresion of the JavaScript runtime.

A compiled version of the library is also made available as a npm package. It can be installed using the npm package manager. It is recommended to use the latest stable version of the npm package manager.

Alternatively, an optimized, compressed and obfuscated version of the library is also made available as a standalone JavaScript file. This file can be downloaded or directly included in a HTML file. It is recommended to use a modern web browser to support the latest JavaScript features.

## Hardware Interfaces
The library is a software library and does not require any strict hardware requirements. It can be executed on any hardware that supports the software requirements.

It is recommended to use a hardware that supports at least a modern web browser or any other JavaScript runtime.

## Communication Interfaces
The library does not interact with any external systems and does not require any communication interfaces. It may be used in conjunction with other libraries that do require communication interfaces. In such cases, the communication interfaces required by the other libraries must be provided.

# Functional Requirements
This section describes the features of the library. Use Cases and examples are provided to illustrate the use of the feature where necessary. The features are described in the form of functional requirements.

## FR1: Callable, Iterable, Iterator
The library provides a class `Arbitrary` that uses factory pattern to generate arbitrary data of given type. An instance of the class satisfies the following requirements:
- It is callable. On each call, it generates a new arbitrary data of the given type.
- It is a generator function which can be used as an iterable. It can be used in a `for...of` loop to generate a sequence of arbitrary data of the given type. The sequence is infinite.
- It is also an iterator. Successive calls to the `next()` method of the instance generates a sequence of arbitrary data of the given type. The sequence is infinite.

### Rationale
The library is designed to be used in a variety of use cases. The use cases may require the arbitrary data to be generated in different ways. The library provides a single class that can be used to generate arbitrary data in easy and flexible ways. The instance of the class can be used as a callable, iterable or an iterator depending on the use case.

### Use Case
The following example illustrates the use of the class `Arbitrary` as a callable, iterable and an iterator.

```typescript
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

const factory = Math.random; // A factory function that generates a random number between 0 and 1
const arbitrary = new Arbitrary(factory); // An instance of the class Arbitrary
let random;

// Use as a callable
random = arbitrary(); // random is a number between 0 and 1

// Use as an iterable
for (random of arbitrary) {
    // random is a number between 0 and 1
    if (random > 0.5) {
        break;
    }
}

// Use as an iterator
random = arbitrary.next().value; // random is a number between 0 and 1
```

## FR2: Stream manipulation
The `Arbitrary` class provides a `map()` method that can be used to transform the arbitrary data generated by the instance. The `map()` method accepts a function that transforms the arbitrary data and returns a new arbitrary data. The `map()` method returns a new instance of the `Arbitrary` class that generates the transformed arbitrary data.

### Rationale
The users of the library may require the arbitrary data to be transformed in different ways. The library provides a method that can be used to transform the arbitrary data in pipelined manner. The method returns a new instance of the `Arbitrary` class that generates the transformed arbitrary data. The new instance can be used to transform the arbitrary data further.

### Use Case
The following example illustrates the use of the `map()` method.

```typescript
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

const range = [15, 35]; // Minimum and maximum values of the range
const factory = Math.random; // A factory function that generates a random number between 0 and 1
const arbitrary = new Arbitrary(factory); // An instance of the class Arbitrary

// Transform the arbitrary data to a number between 15 and 35
const age = arbitrary.map(r => (r * (range[1] - range[0]) + range[0]));

const person = {
    name: "John Doe",
    age: age() // Generate a random age between 15 and 35
};
```

## FR3: Stream filtering
The `Arbitrary` class provides a `filter()` method that can be used to filter the arbitrary data generated by the instance. The `filter()` method accepts a function that filters the arbitrary data and returns a boolean value. The `filter()` method returns a new instance of the `Arbitrary` class that generates the filtered arbitrary data.

### Rationale
The users of the library may require the arbitrary data to be filtered in different ways. The library provides a method that can be used to filter the arbitrary data in pipelined manner. The method returns a new instance of the `Arbitrary` class that generates the filtered arbitrary data. The new instance can be used to filter the arbitrary data further.

### Use Case
The following example illustrates the use of the `filter()` method.

```typescript
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

const factory = Math.random; // A factory function that generates a random number between 0 and 1
const arbitrary = new Arbitrary(factory); // An instance of the class Arbitrary

// Filter the arbitrary data to a number between 0.5 and 1
const generator = arbitrary.filter(r => r > 0.5);

const number = generator(); // All numbers generated by generator() will be greater than 0.5
```

### Constraints
A strict filter may result in a long or infinite loop. The filter function must be designed to avoid such cases.

## FR4: Source of randomness
An instance of the `Arbitrary` class may take an optional parameter `source` of type `Arbitrary` when used as a callable function. The `source` parameter is used as a source of randomness for generating the arbitrary data. If the `source` parameter is not provided, the instance uses some default source of randomness.

### Rationale
The users of the library may require the arbitrary data to be generated using a particular random distribution. The library provides a way to use an instance of the `Arbitrary` class with different random distributions without having to create a new instance every time. This is accomplished by passing a source of randomness to the instance when used as a callable function. The source of randomness itself can be an instance of the `Arbitrary` class that uses a different random distribution.

### Use Case
The following example illustrates use of randomizers to select few items from a larger pool.

```typescript
import { Uniform, Gaussian } from "@dwijbavisi/arbitrary-factory/randomizer";
import { pick } from "@dwijbavisi/arbitrary-factory/lib";

const grades = ["A", "B", "C", "D", "E", "F"]; // Grades
const results = pick(grades).repeat(100); // 100 random grades generator

// Uniform selection
const uniform = new Uniform(0, grades.length); // Min, Max
console.log(results(uniform));

// Gaussian selection
const gaussian = new Gaussian(grades.length / 2, grades.length / 4); // Mean, Std
console.log(results(gaussian));
```

## FR5: Sampling
The `Arbitrary` class provides a `sample()` method that can be used to sample the arbitrary data generated by the instance. The `sample()` method accepts an Arbitrary number `count` and a source of randomness `source`. The `count` parameter specifies the number of samples to be generated. The `source` parameter is used as a source of randomness for generating the samples. If the `source` parameter is not provided, the instance uses some default source of randomness.

The `sample()` method returns an array of arbitrary data of length `count`.

### Rationale
The users of the library may require samples from the arbitrary data generated by the instance. The library provides a method that can be used to sample the arbitrary data. The method returns an array of arbitrary data of specified length. The source of randomness for generating the samples can also be specified.

### Use Case
The following example illustrates the use of the `sample()` method.

```typescript
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

const factory = Math.random; // random number factory
const arbitrary = new Arbitrary(factory); // An instance of the class Arbitrary

// Generate 10 random numbers between 0 and 1
const samples = arbitrary.sample(10);
```

## FR6: Repeated generation
The `Arbitrary` class provides a `repeat()` method that can be used to generate arbitrary data repeatedly. The `repeat()` method accepts an Arbitrary number `times` and returns an instance of `Arbitrary` that generates arbitrary data `times` number of times. The `times` parameter specifies the number of times the arbitrary data is to be generated.

### Rationale
The users of the library may require the arbitrary data to be generated repeatedly. The library provides a method that can be used to generate arbitrary data multiple times in a single call.

### Use Case
The following example illustrates the use of the `repeat()` method.

```typescript
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

const factory = Math.random; // random number factory
const arbitrary = new Arbitrary(factory); // An instance of the class Arbitrary

// Random number generator that generates 10 random numbers
const generator = arbitrary.repeat(10);

const matrix = generator.sample(10); // 10 arrays of 10 random numbers each
```

## FR7: Primitive type casting
The `Arbitrary` class provides support for automatically generating arbitrary data when type casting is expected.

### Rationale
The users of the library may require the arbitrary data to be generated automatically when type casting is expected. This allows the users to use the arbitrary data in place of the expected type without having to explicitly generate the arbitrary data.

### Use Case
The following example illustrates the use of the `Arbitrary` class for type casting.

```typescript
import { Arbitrary } from "@dwijbavisi/arbitrary-factory";

const factory = Math.random; // random number factory
const arbitrary = new Arbitrary(factory); // An instance of the class Arbitrary

const x = 2 * +arbitrary; // Type casting arbitrary instance to random number
```

## FR8: Reproducible results
The library provides randomizers that can be used to generate reproducible results. The randomizers are extensions of the `Arbitrary` class and can be used in place of the `Arbitrary` class to generate random data. `Randomizer` is a base class that can be extended to create custom randomizers. Different randomizers are also provided for common use cases of uniform distribution and gaussian distribution.

### Rationale
The users of the library may require reproducible results. The library provides randomizers that can be used to generate reproducible results. The randomizers are extensions of the `Arbitrary` class and can be used in place of the `Arbitrary` class to generate random data.

### Use Case
The following example illustrates the use of the `Randomizer` class.

```typescript
import { PRNG } from "@dwijbavisi/arbitrary-factory/randomizer";

const factory1 = new PRNG(0); // random number factory
const factory2 = new PRNG(0); // random number factory

console.log(factory1() === factory2()); // both factories generate the same random number
```

## FR9: Mimic properties of the data type
The library provides a `mimic` function to create an arbitrary factory that mimics the properties of the data type. The mimic function accepts an arbitrary factory and returns a proxy object that mimics the properties of the data type. The proxy object can be used as an arbitrary factory to generate arbitrary data of the data type as well as to access the properties of the data type. The properties are also mimicked and can be used as arbitrary factories to generate arbitrary data of the property type.

### Rationale
The users may want to access a property of the data type without having to generate the arbitrary data of the data type. The library provides a way to access the properties of the data type without having to generate the arbitrary data. The properties are also mimicked and can be used as arbitrary factories to generate arbitrary data of the property type. This allows the users to directly work with the properties of complex data types.

### Use Case
The following example illustrates the use of the `mimic()` function.

```typescript
import { mimic } from "@dwijbavisi/arbitrary-factory/mimic";

const pool = mimic(["A", "B", "C"]); // Mimic an array of strings

// Both length and index properties are mimicked
console.log(pool.length); // Arbitrary factory that generates length of the array
console.log(pool[0]); // Arbitrary factory that generates first element of the array
```

# TODO: Performance Requirements
# TODO: System Design
# TODO: Architectural Constraints
# TODO: Testing Instructions
# TODO: Project Management Plan
# TODO: Revision History
