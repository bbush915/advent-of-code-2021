const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.5.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" -> ").flatMap((x) => x.split(",").map((x) => Number(x)));

      return {
        x1: parts[0],
        y1: parts[1],
        x2: parts[2],
        y2: parts[3],
      };
    });
}

function part1() {
  const lines = parseInput();

  const grid = new Array(1000);

  for (let i = 0; i < 1000; i++) {
    grid[i] = new Array(1000).fill(0);
  }

  for (const { x1, x2, y1, y2 } of lines) {
    if (x1 !== x2 && y1 !== y2) {
      continue;
    }

    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);

    for (let i = minX; i <= maxX; i++) {
      for (let j = minY; j <= maxY; j++) {
        ++grid[j][i];
      }
    }
  }

  return grid.flatMap((x) => x).filter((x) => x > 1).length;
}

function part2() {
  const lines = parseInput();

  const grid = new Array(10);

  for (let i = 0; i < 1000; i++) {
    grid[i] = new Array(1000).fill(0);
  }

  for (const { x1, x2, y1, y2 } of lines) {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);

    if (x1 === x2 || y1 === y2) {
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          ++grid[j][i];
        }
      }
    } else {
      const slope = (y2 - y1) / (x2 - x1);

      for (let i = 0; i < maxX - minX + 1; i++) {
        ++grid[slope > 0 ? minY + i : maxY - i][minX + i];
      }
    }
  }

  return grid.flatMap((x) => x).filter((x) => x > 1).length;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
