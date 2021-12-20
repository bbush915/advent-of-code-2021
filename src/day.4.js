const fs = require("fs");

function parseInput() {
  const input = fs.readFileSync("src/day.4.input.txt", "utf-8").split("\n\n");

  const numbers = input[0].split(",").map(Number);

  const boards = input.slice(1).map((x) =>
    x
      .split("\n")
      .filter((x) => x)
      .map((x) => x.split(/\s+/).map(Number))
  );

  return {
    numbers,
    boards,
  };
}

function part1() {
  const { numbers, boards } = parseInput();

  for (const number of numbers) {
    for (const board of boards) {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (board[i][j] === number) {
            board[i][j] = null;

            if (checkWin(board)) {
              const sum = board.flatMap((x) => x).reduce((sum, val) => (sum += val), 0);
              return sum * number;
            }
          }
        }
      }
    }
  }
}

function part2() {
  const { numbers, boards } = parseInput();

  let hasBoardWon = new Array(boards.length).fill(false);
  let lastScore = 0;

  for (const number of numbers) {
    for (let n = 0; n < boards.length; n++) {
      const board = boards[n];

      if (hasBoardWon[n]) {
        continue;
      }

      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (board[i][j] === number) {
            board[i][j] = null;

            if (checkWin(board)) {
              hasBoardWon[n] = true;

              const sum = board.flatMap((x) => x).reduce((sum, val) => (sum += val), 0);
              lastScore = sum * number;
            }
          }
        }
      }
    }
  }

  return lastScore;
}

function checkWin(board) {
  // NOTE - Check rows.

  for (let i = 0; i < 5; i++) {
    let didWin = true;

    for (let j = 0; j < 5; j++) {
      if (board[i][j]) {
        didWin = false;
      }
    }

    if (didWin) {
      return true;
    }
  }

  // NOTE - Check columns.

  for (let i = 0; i < 5; i++) {
    let didWin = true;

    for (let j = 0; j < 5; j++) {
      if (board[j][i]) {
        didWin = false;
      }
    }

    if (didWin) {
      return true;
    }
  }
}

module.exports.part1 = part1;
module.exports.part2 = part2;
