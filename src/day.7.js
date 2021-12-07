const fs = require("fs");

function parseInput() {
  return fs.readFileSync("src/day.7.input.txt", "utf-8").split(",").map(Number);
}

function part1() {
  const positions = parseInput();

  let lowestFuelCost = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < Math.max(...positions); i++) {
    const totalFuel = positions.reduce(
      (totalFuel, fuel) => ((totalFuel += Math.abs(fuel - i)), totalFuel),
      0
    );

    if (totalFuel < lowestFuelCost) {
      lowestFuelCost = totalFuel;
    }
  }

  return lowestFuelCost;
}

function part2() {
  const positions = parseInput();

  let lowestFuelCost = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < Math.max(...positions); i++) {
    const totalFuel = positions.reduce(
      (totalFuel, fuel) => (
        (totalFuel += 0.5 * Math.abs(fuel - i) * (Math.abs(fuel - i) + 1)), totalFuel
      ),
      0
    );

    if (totalFuel < lowestFuelCost) {
      lowestFuelCost = totalFuel;
    }
  }

  return lowestFuelCost;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
