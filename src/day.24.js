const fs = require("fs");

function parseInput() {
  return fs.readFileSync("src/day.24.input.txt", "utf-8");
}

function part1() {
  const input = parseInput();

  console.log(input);

  return 0;
}

function part2() {}

module.exports.part1 = part1;
module.exports.part2 = part2;
