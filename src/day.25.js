const fs = require("fs");

const { clone } = require("./utils/misc");

function parseInput() {
  return fs
    .readFileSync("src/day.25.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

function part1() {
  const grid = parseInput();

  let steps = 0;

  while (1) {
    steps++;

    let didUpdate = false;

    let snapshot;

    // NOTE - East

    snapshot = clone(grid);

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (snapshot[i][j] === ">" && snapshot[i][(j + 1) % grid[i].length] === ".") {
          grid[i][j] = ".";
          grid[i][(j + 1) % grid[i].length] = ">";

          didUpdate = true;
        }
      }
    }

    // NOTE - South

    snapshot = clone(grid);

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (snapshot[i][j] === "v" && snapshot[(i + 1) % grid.length][j] === ".") {
          grid[i][j] = ".";
          grid[(i + 1) % grid.length][j] = "v";

          didUpdate = true;
        }
      }
    }

    if (!didUpdate) {
      break;
    }
  }

  return steps;
}

function part2() {}

module.exports.part1 = part1;
module.exports.part2 = part2;
