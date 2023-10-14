/**
 * @fileoverview Library functions
 */

import test from "node:test";
import { Uniform, Gaussian } from "@dwijbavisi/arbitrary-factory/randomizer";
import { pick, take, shuffle, compose } from "@dwijbavisi/arbitrary-factory/lib";

test("lib: Random user profiles", () => {
  const seed = 1234;

  const age = new Gaussian(35, 10, seed).map(Math.floor);

  const names = ["John", "Jane", "Jack", "Jill"];
  const name = pick(names, seed);

  const hobbies = ["reading", "writing", "coding", "singing"];
  const interests = new Uniform(1, 4, seed).map(Math.floor);
  const hobby = take(interests, hobbies, seed);

  const profile = compose`${name} is ${age} years old and likes ${hobby}`;

  console.log(profile.sample(10));
});

test("lib: Random cards", () => {
  const seed = 1234;

  const suits = ["♠", "♥", "♦", "♣"];
  const numbers = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const royals = ["J", "Q", "K"];

  const cards = suits
    .flatMap(suit => numbers.map(number => `${suit}${number}`))
    .concat(suits
      .flatMap(suit => royals.map(royal => `${suit}${royal}`))
    );

  const deck = shuffle(cards, seed);
  const hand = compose`Your hand is ${deck[0]}, ${deck[1]}, ${deck[2]}, ${deck[3]}, ${deck[4]}`;

  console.log(hand.sample(10));
});
