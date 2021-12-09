const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.9.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("").map(Number));
}

function part1() {
  const floor = parseInput();

  let totalRiskLLevel = 0;

  for (let i = 0; i < floor.length; i++) {
    for (let j = 0; j < floor[i].length; j++) {
      if (checkAdjacent(floor, i, j)) {
        totalRiskLLevel += floor[i][j] + 1;
      }
    }
  }

  return totalRiskLLevel;
}

function part2() {
  const floor = parseInput();

  const basinSizes = [];

  for (let i = 0; i < floor.length; i++) {
    for (let j = 0; j < floor[i].length; j++) {
      if (checkAdjacent(floor, i, j)) {
        const basinSize = getBasinSize(floor, i, j);
        basinSizes.push(basinSize);
      }
    }
  }

  return basinSizes
    .sort((x, y) => y - x)
    .slice(0, 3)
    .reduce((product, basinSize) => (product *= basinSize), 1);
}

function checkAdjacent(floor, i, j) {
  const height = floor[i][j];

  return (
    height < getHeight(floor, i - 1, j) &&
    height < getHeight(floor, i, j + 1) &&
    height < getHeight(floor, i + 1, j) &&
    height < getHeight(floor, i, j - 1)
  );
}

function getBasinSize(floor, i, j) {
  let basinSize = 0;

  const queue = [{ x: i, y: j }];
  const visited = new Map();

  while (queue.length > 0) {
    const { x, y } = queue.shift();

    if (visited.get(`${x}|${y}`)) {
      continue;
    } else {
      visited.set(`${x}|${y}`, true);
      basinSize++;
    }

    const height = floor[x][y];

    // NOTE - Up

    const up = getHeight(floor, x - 1, y);

    if (up < 9 && height < up) {
      queue.push({ x: x - 1, y });
    }

    // NOTE - Right

    const right = getHeight(floor, x, y + 1);

    if (right < 9 && height < right) {
      queue.push({ x, y: y + 1 });
    }

    // NOTE - Down

    const down = getHeight(floor, x + 1, y);

    if (down < 9 && height < down) {
      queue.push({ x: x + 1, y });
    }

    // NOTE - Left

    const left = getHeight(floor, x, y - 1);

    if (left < 9 && height < left) {
      queue.push({ x, y: y - 1 });
    }
  }

  return basinSize;
}

function getHeight(floor, i, j) {
  if (i < 0 || i >= floor.length || j < 0 || j >= floor[i].length) {
    return 10;
  }

  return floor[i][j];
}

module.exports.part1 = part1;
module.exports.part2 = part2;
