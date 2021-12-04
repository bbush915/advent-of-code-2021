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

        rateBits.gammaBits.push(oneMostCommon ? 1 : 0);
        rateBits.epsilonBits.push(oneMostCommon ? 0 : 1);

        return rateBits;
      },
      { gammaBits: [], epsilonBits: [] }
    );

  return parseBits(gammaBits) * parseBits(epsilonBits);
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
    const count = possibilities.reduce((count, diagnostic) => {
      count += diagnostic[i];
      return count;
    }, 0);

    let oneMostCommon = count >= possibilities.length / 2;

    if (invert) {
      oneMostCommon = !oneMostCommon;
    }

    possibilities = possibilities.filter((x) => x[i] === (oneMostCommon ? 1 : 0));

    if (possibilities.length === 1) {
      return parseBits(possibilities[0]);
    }
  }
}

function parseBits(bits) {
  return parseInt(bits.join(""), 2);
}

module.exports.part1 = part1;
module.exports.part2 = part2;
