const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.8.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" | ");

      return {
        signals: parts[0].split(" ").map((x) => x.split("").sort((x, y) => x.localeCompare(y))),
        outputs: parts[1].split(" ").map((x) => x.split("").sort((x, y) => x.localeCompare(y))),
      };
    });
}

function part1() {
  const input = parseInput();

  // return input.reduce(
  //   (sum, { outputs }) => (sum += outputs.filter((x) => [2, 3, 4, 7].includes(x.length)).length),
  //   0
  // );
}

function part2() {
  const input = parseInput();

  return input.reduce((sum, value) => (sum += getDigits(value)), 0);
}

function getDigits({ signals, outputs }) {
  const mapping = new Array(10);

  const clone = signals.slice(0);

  let index = clone.findIndex((x) => x.length === 2);
  mapping[1] = clone.splice(index, 1)[0];

  index = clone.findIndex((x) => x.length === 4);
  mapping[4] = clone.splice(index, 1)[0];

  index = clone.findIndex((x) => x.length === 3);
  mapping[7] = clone.splice(index, 1)[0];

  index = clone.findIndex((x) => x.length === 7);
  mapping[8] = clone.splice(index, 1)[0];

  index = clone.findIndex((x) => x.length === 5 && mapping[1].every((y) => x.includes(y)));
  mapping[3] = clone.splice(index, 1)[0];

  index = clone.findIndex(
    (x) => x.length === 5 && mapping[4].filter((y) => x.includes(y)).length === 2
  );
  mapping[2] = clone.splice(index, 1)[0];

  index = clone.findIndex(
    (x) => x.length === 5 && mapping[4].filter((y) => x.includes(y)).length === 3
  );
  mapping[5] = clone.splice(index, 1)[0];

  index = clone.findIndex(
    (x) => x.length === 6 && mapping[4].filter((y) => x.includes(y)).length === 4
  );
  mapping[9] = clone.splice(index, 1)[0];

  index = clone.findIndex(
    (x) => x.length === 6 && mapping[5].filter((y) => x.includes(y)).length === 5
  );
  mapping[6] = clone.splice(index, 1)[0];

  mapping[0] = clone[0];

  const blah = outputs
    .map(
      (x) =>
        Object.entries(mapping).find(
          (y) => y[1].length === x.length && y[1].every((z) => x.includes(z))
        )[0]
    )
    .join("");

  const result = parseInt(blah, 10);

  return result;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
