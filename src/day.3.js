const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.3.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("").map((x) => Number(x)));
}

function part1() {
  const diagnostics = parseInput();

  const { gammaBits, epsilonBits } = diagnostics
    .reduce((counts, diagnostic) => {
      for (let i = 0; i < 12; i++) {
        counts[i] += diagnostic[i];
      }

      return counts;
    }, new Array(12).fill(0))
    .reduce(
      (rateBits, count) => {
        const oneMostCommon = count >= 500;

        rateBits.gammaBits.push(oneMostCommon ? "1" : "0");
        rateBits.epsilonBits.push(oneMostCommon ? "0" : "1");

        return rateBits;
      },
      { gammaBits: [], epsilonBits: [] }
    );

  return parseInt(gammaBits.join(""), 2) * parseInt(epsilonBits.join(""), 2);
}

function part2() {
  const diagnostics = parseInput();

  const oxygenRating = getRating(diagnostics, false);
  const co2Rating = getRating(diagnostics, true);

  return oxygenRating * co2Rating;
}

function getRating(diagnostics, invert) {
  let possibilities = diagnostics.slice(0);

  for (let i = 0; i < 12; i++) {
    const counts = possibilities.reduce((counts, diagnostic) => {
      for (let i = 0; i < 12; i++) {
        counts[i] += diagnostic[i];
      }

      return counts;
    }, new Array(12).fill(0));

    let oneMostCommon = counts[i] >= Math.floor(possibilities.length / 2);

    if (invert) {
      oneMostCommon = !oneMostCommon;
    }

    possibilities = possibilities.filter((x) => x[i] === (oneMostCommon ? 1 : 0));

    if (possibilities.length === 1) {
      return parseInt(possibilities[0].map((x) => String(x)).join(""), 2);
    }
  }
}

module.exports.part1 = part1;
module.exports.part2 = part2;
