const fs = require("fs");

const { clone } = require("../src/utils/misc");

function parseInput() {
  return fs
    .readFileSync("src/day.15.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("").map(Number));
}

function part1() {
  const input = parseInput();

  const expandedInput = new Array(5 * input.length);

  for (let i = 0; i < expandedInput.length; i++) {
    expandedInput[i] = new Array(5 * input[0].length);
  }

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          expandedInput[i + x * input.length][j + y * input[i].length] =
            ((input[i][j] + x + y - 1) % 9) + 1;
        }
      }
    }
  }

  const distances = {};
  distances[`0|0`] = 0;

  const previous = {};

  const priority = [];

  for (let i = 0; i < expandedInput.length; i++) {
    for (let j = 0; j < expandedInput[i].length; j++) {
      const key = `${i}|${j}`;

      if (i !== 0 || j !== 0) {
        distances[key] = Number.MAX_SAFE_INTEGER;
        previous[key] = undefined;
      }

      priority.push([key, distances[key]]);
    }
  }

  while (priority.length > 0) {
    console.log(priority.length);
    priority.sort((x, y) => y[1] - x[1]);

    const [key, distance] = priority.pop();

    const [i, j] = key.split("|").map(Number);

    let alt = 0;

    // Right
    if (j < expandedInput[i].length - 1) {
      const neighborKey = `${i}|${j + 1}`;
      alt = distance + expandedInput[i][j + 1];

      if (alt < distances[neighborKey]) {
        distances[neighborKey] = alt;
        previous[neighborKey] = key;

        priority.find((x) => x[0] === neighborKey)[1] = alt;
      }
    }

    // Left
    if (j > 0) {
      const neighborKey = `${i}|${j - 1}`;
      alt = distance + expandedInput[i][j - 1];

      if (alt < distances[neighborKey]) {
        distances[neighborKey] = alt;
        previous[neighborKey] = key;

        priority.find((x) => x[0] === neighborKey)[1] = alt;
      }
    }
    // Down
    if (i < expandedInput.length - 1) {
      const neighborKey = `${i + 1}|${j}`;
      alt = distances[key] + expandedInput[i + 1][j];

      if (alt < distances[neighborKey]) {
        distances[neighborKey] = alt;
        previous[neighborKey] = key;

        priority.find((x) => x[0] === neighborKey)[1] = alt;
      }
    }

    // Up
    if (i > 0) {
      const neighborKey = `${i - 1}|${j}`;
      alt = distances[key] + expandedInput[i - 1][j];

      if (alt < distances[neighborKey]) {
        distances[neighborKey] = alt;
        previous[neighborKey] = key;

        priority.find((x) => x[0] === neighborKey)[1] = alt;
      }
    }
  }

  return distances[`${expandedInput.length - 1}|${expandedInput[0].length - 1}`];
}

function part2() {}

module.exports.part1 = part1;
module.exports.part2 = part2;
