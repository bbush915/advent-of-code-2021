const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.2.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");

      return {
        direction: parts[0],
        value: Number(parts[1]),
      };
    });
}

function part1() {
  const commands = parseInput();

  let position = 0;
  let depth = 0;

  for (let i = 0; i < commands.length; i++) {
    const { direction, value } = commands[i];

    if (direction === "forward") {
      position += value;
    }

    if (direction === "down") {
      depth += value;
    }

    if (direction === "up") {
      depth -= value;
    }
  }

  return position * depth;
}

function part2() {
  const commands = parseInput();

  let position = 0;
  let depth = 0;
  let aim = 0;

  for (let i = 0; i < commands.length; i++) {
    const { direction, value } = commands[i];

    if (direction === "forward") {
      position += value;
      depth += aim * value;
    }

    if (direction === "down") {
      aim += value;
    }

    if (direction === "up") {
      aim -= value;
    }
  }

  return position * depth;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
