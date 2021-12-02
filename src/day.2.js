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
    const command = commands[i];

    if (command.direction === "forward") {
      position += command.value;
    }

    if (command.direction === "down") {
      depth += command.value;
    }

    if (command.direction === "up") {
      depth -= command.value;
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
    const command = commands[i];

    if (command.direction === "forward") {
      position += command.value;
      depth += aim * command.value;
    }

    if (command.direction === "down") {
      aim += command.value;
    }

    if (command.direction === "up") {
      aim -= command.value;
    }
  }

  return position * depth;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
