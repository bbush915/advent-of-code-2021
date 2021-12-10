const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.10.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

const CLOSE_MAP = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

const P1_SCORE_MAP = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const P2_SCORE_MAP = {
  "(": 1,
  "[": 2,
  "{": 3,
  "<": 4,
};

function part1() {
  const lines = parseInput();

  let score = 0;

  for (const line of lines) {
    const opens = [];

    for (const character of line) {
      switch (character) {
        case "(":
        case "[":
        case "{":
        case "<": {
          opens.push(character);
          break;
        }

        case ")":
        case "]":
        case "}":
        case ">": {
          const open = opens.pop();

          if (character !== CLOSE_MAP[open]) {
            score += P1_SCORE_MAP[character];
          }

          break;
        }
      }
    }
  }

  return score;
}

function part2() {
  const lines = parseInput();

  let scores = [];

  outer: for (const line of lines) {
    const opens = [];

    for (const character of line) {
      switch (character) {
        case "(":
        case "[":
        case "{":
        case "<": {
          opens.push(character);
          break;
        }

        case ")":
        case "]":
        case "}":
        case ">": {
          const open = opens.pop();

          if (character !== CLOSE_MAP[open]) {
            continue outer;
          }

          break;
        }
      }
    }

    const score = opens.reverse().reduce((sum, open) => (sum = 5 * sum + P2_SCORE_MAP[open]), 0);
    scores.push(score);
  }

  scores.sort((x, y) => x - y);

  return scores[Math.floor(scores.length / 2)];
}

module.exports.part1 = part1;
module.exports.part2 = part2;
