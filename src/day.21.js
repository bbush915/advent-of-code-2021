const fs = require("fs");

const { clone } = require("./utils/misc");

function parseInput() {
  return fs
    .readFileSync("src/day.21.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => Number(x.match(/\d+$/)));
}

function part1() {
  const positions = parseInput();
  const scores = [0, 0];

  let turn = 0;

  let die = 1;
  let count = 0;

  while (Math.max(...scores) < 1000) {
    positions[turn] = ((positions[turn] + 3 * die + 2) % 10) + 1;
    scores[turn] += positions[turn];

    die = ((die + 2) % 100) + 1;
    count += 3;

    turn = 1 - turn;
  }

  return Math.min(...scores) * count;
}

function part2() {
  const positions = parseInput();
  const wins = [0, 0];

  playTurn(positions, [0, 0], 0, 1, wins);

  return Math.max(...wins);
}

const DIRAC_COUNTS = {
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1,
};

function playTurn(positions, scores, turn, count, wins) {
  if (Math.max(...scores) >= 21) {
    wins[0] += scores[0] >= 21 ? count : 0;
    wins[1] += scores[1] >= 21 ? count : 0;

    return;
  }

  for (const [move, innerCount] of Object.entries(DIRAC_COUNTS)) {
    const newPositions = clone(positions);
    const newScores = clone(scores);

    newPositions[turn] = ((newPositions[turn] + Number(move) - 1) % 10) + 1;
    newScores[turn] += newPositions[turn];

    playTurn(newPositions, newScores, 1 - turn, count * innerCount, wins);
  }
}

module.exports.part1 = part1;
module.exports.part2 = part2;
