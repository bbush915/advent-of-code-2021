const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.1.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => Number(x));
}

function part1() {
  const measurements = parseInput();

  let count = 0;

  for (let i = 1; i < measurements.length; i++) {
    if (measurements[i] > measurements[i - 1]) {
      count++;
    }
  }

  return count;
}

function part2() {
  const measurements = parseInput();

  let count = 0;

  for (let i = 3; i < measurements.length; i++) {
    if (measurements[i] > measurements[i - 3]) {
      count++;
    }
  }

  return count;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
