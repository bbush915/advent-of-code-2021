const fs = require("fs");

const { dijkstra } = require("./utils/algorithms");

function parseInput() {
  return fs
    .readFileSync("src/day.15.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("").map(Number));
}

function part1() {
  const riskLevels = parseInput();
  return getTotalRiskLevel(riskLevels);
}

function part2() {
  const riskLevels = parseInput();

  const expandedRiskLevels = new Array(5 * riskLevels.length);

  for (let i = 0; i < expandedRiskLevels.length; i++) {
    expandedRiskLevels[i] = new Array(5 * riskLevels[0].length);
  }

  for (let i = 0; i < riskLevels.length; i++) {
    for (let j = 0; j < riskLevels[i].length; j++) {
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          expandedRiskLevels[i + x * riskLevels.length][j + y * riskLevels[i].length] =
            ((riskLevels[i][j] + x + y - 1) % 9) + 1;
        }
      }
    }
  }

  return getTotalRiskLevel(expandedRiskLevels);
}

function getTotalRiskLevel(riskLevels) {
  const graph = {
    getNeighbors: curryGetNeighbors(riskLevels),
    getDistance: curryGetDistance(riskLevels),
  };

  const source = getKey(0, 0);
  const target = getKey(riskLevels.length - 1, riskLevels.length - 1);

  const { distanceLookup } = dijkstra(graph, source, target);

  return distanceLookup.get(target);
}

function curryGetNeighbors(riskLevels) {
  return function getNeighbors(key) {
    const [i, j] = key.split("|").map(Number);

    const neighbors = [];

    // NOTE - Top

    if (i > 0) {
      neighbors.push(getKey(i - 1, j));
    }

    // NOTE - Right

    if (j < riskLevels.length - 1) {
      neighbors.push(getKey(i, j + 1));
    }

    // NOTE - Bottom

    if (i < riskLevels.length - 1) {
      neighbors.push(getKey(i + 1, j));
    }

    // NOTE - Left

    if (j > 0) {
      neighbors.push(getKey(i, j - 1));
    }

    return neighbors;
  };
}

function curryGetDistance(riskLevels) {
  return function getDistance(_u, v) {
    const [i, j] = v.split("|").map(Number);

    return riskLevels[i][j];
  };
}

function getKey(i, j) {
  return `${i}|${j}`;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
