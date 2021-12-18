const fs = require("fs");

// NOTE - Can look at triangular numbers (T_n) to restrict minimum x velocity.
// 16 + 15 + ... + 1 = 136 > 135, but 15 + 14 + ... + 1 = 120 < 135.
const MIN_DX = 16;

// NOTE - Can't be greater than the upper x bound of target area.
const MAX_DX = 155;

// NOTE - Can't be less than the lower y bound of target area.
const MIN_DY = -102;

// NOTE - Note that for dy > 0, we will return to y = 0 with dy = -(initial
// value + 1). So, initial value can't be greater the absolute value of the
// lower bound of target area - 1, otherwise we will shoot past it.
const MAX_DY = 101;

function parseInput() {
  const matches = Array.from(
    fs
      .readFileSync("src/day.17.input.txt", "utf-8")
      .matchAll(/(x|y)=(?<min>-?\d+)\.\.(?<max>-?\d+)/g)
  );

  const minX = Number(matches[0].groups.min);
  const maxX = Number(matches[0].groups.max);
  const minY = Number(matches[1].groups.min);
  const maxY = Number(matches[1].groups.max);

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}

function part1() {
  const targetArea = parseInput();

  let maxY = 0;

  for (let dx = MIN_DX; dx <= MAX_DX; dx++) {
    for (let dy = MIN_DY; dy <= MAX_DY; dy++) {
      const result = launch(dx, dy, targetArea);

      if (result.success && result.maxY > maxY) {
        maxY = result.maxY;
      }
    }
  }

  return maxY;
}

function part2() {
  const targetArea = parseInput();

  let count = 0;

  for (let dx = MIN_DX; dx <= MAX_DX; dx++) {
    for (let dy = MIN_DY; dy <= MAX_DY; dy++) {
      const { success } = launch(dx, dy, targetArea);

      if (success) {
        count++;
      }
    }
  }

  return count;
}

function launch(dx, dy, targetArea) {
  let x = 0;
  let y = 0;

  let maxY = 0;

  while (true) {
    x += dx;
    y += dy;

    dx += dx === 0 ? 0 : -1;
    dy--;

    if (y > maxY) {
      maxY = y;
    }

    if (hitTargetArea(x, y, targetArea)) {
      return {
        success: true,
        maxY,
      };
    }

    if ((x < targetArea.minX && dx === 0) || x > targetArea.maxX || y < targetArea.minY) {
      return {
        success: false,
      };
    }
  }
}

function hitTargetArea(x, y, { minX, maxX, minY, maxY }) {
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
