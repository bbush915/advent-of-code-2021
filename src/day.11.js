const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.11.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      return x.split("").map(Number);
    });
}

function part1() {
  const energyLevels = parseInput();

  let flashes = 0;

  for (let step = 0; step < 100; step++) {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        energyLevels[x][y]++;
      }
    }

    while (energyLevels.flatMap((x) => x).filter((x) => x > 9).length > 0) {
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          if (energyLevels[x][y] > 9) {
            propagateFlash(energyLevels, x, y);
            flashes++;
          }
        }
      }
    }
  }

  return flashes;
}

function part2() {
  const energyLevels = parseInput();

  let step = 1;

  while (true) {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        energyLevels[x][y]++;
      }
    }

    let flashes = 0;

    while (energyLevels.flatMap((x) => x).filter((x) => x > 9).length > 0) {
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          if (energyLevels[x][y] > 9) {
            propagateFlash(energyLevels, x, y);
            flashes++;
          }
        }
      }
    }

    if (flashes === 100) {
      break;
    }

    step++;
  }

  return step;
}

function propagateFlash(energyLevels, x, y) {
  energyLevels[x][y] = 0;

  // NOTE - Top left.

  if (getEnergyLevel(energyLevels, x - 1, y - 1) > 0) {
    energyLevels[x - 1][y - 1]++;
  }

  // NOTE - Top.

  if (getEnergyLevel(energyLevels, x - 1, y) > 0) {
    energyLevels[x - 1][y]++;
  }

  // NOTE - Top right.

  if (getEnergyLevel(energyLevels, x - 1, y + 1) > 0) {
    energyLevels[x - 1][y + 1]++;
  }

  // NOTE - Left.

  if (getEnergyLevel(energyLevels, x, y - 1) > 0) {
    energyLevels[x][y - 1]++;
  }

  // NOTE - Right.

  if (getEnergyLevel(energyLevels, x, y + 1) > 0) {
    energyLevels[x][y + 1]++;
  }

  // NOTE - Bottom left.

  if (getEnergyLevel(energyLevels, x + 1, y - 1) > 0) {
    energyLevels[x + 1][y - 1]++;
  }

  // NOTE - Bottom.

  if (getEnergyLevel(energyLevels, x + 1, y) > 0) {
    energyLevels[x + 1][y]++;
  }

  // NOTE - Bottom right.

  if (getEnergyLevel(energyLevels, x + 1, y + 1) > 0) {
    energyLevels[x + 1][y + 1]++;
  }
}

function getEnergyLevel(input, x, y) {
  if (x < 0 || x >= input.length || y < 0 || y >= input[x].length) {
    return null;
  }

  return input[x][y];
}

module.exports.part1 = part1;
module.exports.part2 = part2;
