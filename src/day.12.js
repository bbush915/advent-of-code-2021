const fs = require("fs");

const START_LABEL = "start";
const END_LABEL = "end";

function parseInput() {
  return fs
    .readFileSync("src/day.12.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("-"))
    .reduce(buildCaveSystem, {});
}

function buildCaveSystem(caves, [x, y]) {
  if (!caves[x]) {
    caves[x] = makeCave(x);
  }

  caves[x].connections.push(y);

  if (!caves[y]) {
    caves[y] = makeCave(y);
  }

  caves[y].connections.push(x);

  return caves;
}

function makeCave(label) {
  return {
    label,
    isBig: label.toUpperCase() === label,
    connections: [],
  };
}

function part1() {
  const caves = parseInput();
  return searchCaveSystem(caves, validateNoDuplicateSmallCaves);
}

function part2() {
  const caves = parseInput();
  return searchCaveSystem(caves, validateAtMostOneDuplicateSmallCave);
}

function searchCaveSystem(caves, isValidPath) {
  const paths = [];
  const incompletePaths = [[START_LABEL]];

  while (incompletePaths.length > 0) {
    const path = incompletePaths.pop();

    const { connections } = caves[path[path.length - 1]];

    for (const connection of connections) {
      const connectedCave = caves[connection];

      if (!isValidPath(caves, path, connectedCave)) {
        continue;
      }

      // NOTE - If we made it out, we are done, otherwise, we need to keep
      // searching.

      if (connection === END_LABEL) {
        paths.push([...path, connection]);
      } else {
        incompletePaths.push([...path, connection]);
      }
    }
  }

  return paths.length;
}

function validateNoDuplicateSmallCaves(_caves, path, { isBig, label }) {
  // NOTE - Big caves can be visited any number of times, and small caves can
  // be visited at most once.

  return isBig || !path.includes(label);
}

function validateAtMostOneDuplicateSmallCave(caves, path, { isBig, label }) {
  // NOTE - Big caves can be visited any number of times, a single small cave
  // can be visited at most twice, and the remaining small caves can be visited
  // at most once.

  // NOTE - Don't need to validate big caves.

  if (isBig) {
    return true;
  }

  // NOTE - Can't revisit start.

  if (label === START_LABEL) {
    return false;
  }

  const counts = [...path, label].reduce((counts, label) => {
    const { isBig } = caves[label];

    // NOTE - We only need to count small caves.

    if (isBig) {
      return counts;
    }

    if (!counts[label]) {
      counts[label] = 0;
    }

    counts[label]++;

    return counts;
  }, {});

  return (
    Object.values(counts).filter((x) => x === 2).length <= 1 &&
    Object.values(counts).every((x) => x <= 2)
  );
}

module.exports.part1 = part1;
module.exports.part2 = part2;
