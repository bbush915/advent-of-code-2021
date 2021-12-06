const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.6.input.txt", "utf-8")
    .split(",")
    .map((x) => Number(x))
    .reduce((timerCounts, timer) => {
      timerCounts[timer]++;

      return timerCounts;
    }, new Array(9).fill(0));
}

function part1() {
  const timerCounts = parseInput();
  return simulateDays(timerCounts, 80);
}

function part2() {
  const timerCounts = parseInput();
  return simulateDays(timerCounts, 256);
}

function simulateDays(timerCounts, n) {
  for (let i = 0; i < n; i++) {
    const newLanternfishCount = timerCounts[0];

    for (let j = 0; j < timerCounts.length; j++) {
      timerCounts[j] = timerCounts[j + 1];
    }

    timerCounts[6] += newLanternfishCount;
    timerCounts[8] = newLanternfishCount;
  }

  return Object.values(timerCounts).reduce((sum, val) => ((sum += val), sum), 0);
}

module.exports.part1 = part1;
module.exports.part2 = part2;
