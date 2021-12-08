const fs = require("fs");

const { clone } = require("./utils/misc");

function parseInput() {
  return fs
    .readFileSync("src/day.8.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const [signals, outputs] = x.split(" | ").map((x) =>
        x.split(" ").map((x) =>
          x
            .split("")
            .sort((x, y) => x.localeCompare(y))
            .join("")
        )
      );

      return {
        signals,
        outputs,
      };
    });
}

function part1() {
  const displays = parseInput();

  return displays.reduce(
    (sum, { outputs }) => (sum += outputs.filter((x) => [2, 3, 4, 7].includes(x.length)).length),
    0
  );
}

function part2() {
  const displays = parseInput();
  return displays.reduce((sum, display) => (sum += getOutputValue(display)), 0);
}

function getOutputValue({ signals, outputs }) {
  const digitMapping = new Array(10);

  const possibilities = clone(signals);

  let index;

  // NOTE - Unique length

  index = possibilities.findIndex((x) => x.length === 2);
  digitMapping[1] = possibilities.splice(index, 1)[0];

  index = possibilities.findIndex((x) => x.length === 4);
  digitMapping[4] = possibilities.splice(index, 1)[0];

  index = possibilities.findIndex((x) => x.length === 3);
  digitMapping[7] = possibilities.splice(index, 1)[0];

  index = possibilities.findIndex((x) => x.length === 7);
  digitMapping[8] = possibilities.splice(index, 1)[0];

  // NOTE - 3 is the only 5 segment number that overlaps with 1.

  index = possibilities.findIndex((x) => x.length === 5 && countOverlap(digitMapping[1], x) === 2);
  digitMapping[3] = possibilities.splice(index, 1)[0];

  // NOTE - 2 and 5 are 5 segment numbers that will have a different number of
  // overlapping segments with 4.

  index = possibilities.findIndex((x) => x.length === 5 && countOverlap(digitMapping[4], x) === 2);
  digitMapping[2] = possibilities.splice(index, 1)[0];

  index = possibilities.findIndex((x) => x.length === 5 && countOverlap(digitMapping[4], x) === 3);
  digitMapping[5] = possibilities.splice(index, 1)[0];

  // NOTE - 9 is the only 6 segment number that overlaps with 4.

  index = possibilities.findIndex((x) => x.length === 6 && countOverlap(digitMapping[4], x) === 4);
  digitMapping[9] = possibilities.splice(index, 1)[0];

  // NOTE - 6 is the only 6 segment number that overlaps with 5.

  index = possibilities.findIndex((x) => x.length === 6 && countOverlap(digitMapping[5], x) === 5);
  digitMapping[6] = possibilities.splice(index, 1)[0];

  // NOTE - Last possibility is 0.

  digitMapping[0] = possibilities[0];

  // NOTE - Calculate output value.

  return parseInt(
    outputs.map((x) => Object.entries(digitMapping).find((y) => y[1] === x)[0]).join(""),
    10
  );
}

function countOverlap(x, y) {
  const xParts = x.split("");
  const yParts = y.split("");

  return xParts.filter((x) => yParts.includes(x)).length;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
