import {
  // Arbitrary, Randomizer, Mimic,
  random, lib
} from "../build/index.js"

const {
  UniformRandomizer,
  GaussianRandomizer,
  ExponentialRandomizer
} = random;

const { pick, take, shuffle, compose } = lib;

// Test 1: Arbitrary numbers
(function () {
  console.log("Test 1: Arbitrary numbers");

  const uniform = new UniformRandomizer(-10, 10);
  console.log("uniform", uniform);
  const gaussian = new GaussianRandomizer(30, 10);
  console.log("gaussian", gaussian);
  const exponential = new ExponentialRandomizer(0.1);
  console.log("exponential", exponential);

  const square = uniform.map(x => x * x);
  console.log("square", square);
  const even = uniform.map(Math.floor).filter(x => x % 2 === 0);
  console.log("even", even);
  const arr = uniform.repeat(10);
  console.log("arr", arr);

  const string = uniform.toString();
  console.log("string", string);
  const value = uniform.valueOf();
  console.log("value", value);
  const tag = uniform[Symbol.toStringTag];
  console.log("tag", tag);
  const primitive = uniform[Symbol.toPrimitive]("string");
  console.log("primitive", primitive);

  const sample = uniform.sample(10);
  console.log("sample", sample);

  console.log("END")
}());

// Test 2: Arbitrary user profiles
(function () {
  const names = [
    "John", "Jane", "Jack", "Jill", "Joe", "Judy",
    "James", "Jenny", "Jim", "Jessica", "Jason", "Julia"
  ];
  const hobbies = [
    "reading", "writing", "swimming", "running", "hiking", "biking",
    "singing", "dancing", "acting", "painting", "drawing", "sculpting"
  ];

  const name = pick(names);
  const age = new GaussianRandomizer(30, 10).map(Math.floor);
  const hobby = take(3, hobbies);
  const profile = compose`${name} is ${age} years old and likes ${hobby[0]}, ${hobby[1]}, and ${hobby[2]}.`;

  console.log("Test 2: Arbitrary user profiles");
  console.log(profile);
  console.log(profile);
  console.log(profile);
  console.log("END");
})();

// Test 3: Arbitrary hands of cards
(function () {
  const cards = [
    "A♧", "2♧", "3♧", "4♧", "5♧", "6♧", "7♧", "8♧", "9♧", "10♧", "J♧", "Q♧", "K♧",
    "A♢", "2♢", "3♢", "4♢", "5♢", "6♢", "7♢", "8♢", "9♢", "10♢", "J♢", "Q♢", "K♢",
    "A♡", "2♡", "3♡", "4♡", "5♡", "6♡", "7♡", "8♡", "9♡", "10♡", "J♡", "Q♡", "K♡",
    "A♤", "2♤", "3♤", "4♤", "5♤", "6♤", "7♤", "8♤", "9♤", "10♤", "J♤", "Q♤", "K♤"
  ];

  const deck = shuffle(cards);
  const game = compose`Your hand is ${deck[0]}, ${deck[1]}, ${deck[2]}, ${deck[3]}, and ${deck[4]}.`;

  console.log("Test 3: Arbitrary hands of cards");
  console.log(game);
  console.log(game);
  console.log(game);
  console.log("END");
})();

// Test 4: Arbitrary dice rolls
(function () {
  const dice = [
    "1", "2", "3", "4", "5", "6"
  ];

  const roll = pick(dice);
  const game = compose`You rolled ${roll} and ${roll}.`;

  console.log("Test 4: Arbitrary dice rolls");
  console.log(game);
  console.log(game);
  console.log(game);
  console.log("END");
})();
