import * as fs from "fs";
import { exit } from "process";

let rawInput = "";

try {
  rawInput = fs.readFileSync("src/input.txt", "utf8");
} catch (err) {
  exit(1);
}

// Part one

const partOneResult = rawInput
  .replaceAll(/[^\d\n]+/g, "")
  .split("\n")
  .reduce<number>((total, str) => {
    const numbers = str.replace("\n", "").split("").map(Number);
    return total + parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`, 10);
  }, 0);

console.log(`Part one: ${partOneResult}`);

// Part two

const WORD_DIGITS: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const words = Object.keys(WORD_DIGITS);

const partTwoResult = rawInput.split("\n").reduce<number>((total, line) => {
  let wordsIndexMapping: { index: number; word: string }[] = [];

  words.forEach((word) => {
    wordsIndexMapping.push(
      ...[...line.matchAll(new RegExp(word, "gi"))]
        .map((find) => find.index)
        .map((index) => ({
          index: index ?? -1,
          word,
        }))
    );
  });

  wordsIndexMapping.sort((a, b) => b.index - a.index);

  const start = wordsIndexMapping[0];
  const end = wordsIndexMapping[wordsIndexMapping.length - 1];
  let str = line;

  if (start) {
    str =
      str.substring(0, start.index) +
      WORD_DIGITS[start.word] +
      str.substring(start.index + WORD_DIGITS[start.word].length);
  }

  if (end) {
    str =
      str.substring(0, end.index) +
      WORD_DIGITS[end.word] +
      str.substring(end.index + WORD_DIGITS[end.word].length);
  }

  const numbers = str.replaceAll(/[^\d]+/g, "");
  if (!numbers.length) {
    return total;
  }

  return total + parseInt(`${numbers[0]}${numbers[numbers.length - 1]}`, 10);
}, 0);

console.log(`Part two: ${partTwoResult}`);
