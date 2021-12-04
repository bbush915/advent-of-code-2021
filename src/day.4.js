const fs = require("fs");

function parseInput() {
  const input = fs
    .readFileSync("src/day.4.input.txt", "utf-8")
    .split("\n\n")
    .filter((x) => x);

  const numbers = input[0].split(",").map((x) => Number(x));

  const boards = input
    .slice(1)
    .map((x) => x.split("\n").map((x) => x.split(/\s+/).map((x) => Number(x))));

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
              const sum = board
                .flatMap((x) => x)
                .reduce((sum, val) => ((sum += val ? val : 0), sum), 0);

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
    for (let idx = 0; idx < boards.length; idx++) {
      const board = boards[idx];

      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (board[i][j] === number) {
            board[i][j] = null;

            if (hasBoardWon[idx]) {
              continue;
            }

            if (checkWin(board)) {
              hasBoardWon[idx] = true;

              const sum = board
                .flatMap((x) => x)
                .reduce((sum, val) => ((sum += val ? val : 0), sum), 0);

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
  for (let i = 0; i < 5; i++) {
    let rowWin = true;
    let columnWin = true;

    for (let j = 0; j < 5; j++) {
      if (board[i][j]) {
        rowWin = false;
      }

      if (board[j][i]) {
        columnWin = false;
      }
    }

    if (rowWin || columnWin) {
      return true;
    }
  }
}

module.exports.part1 = part1;
module.exports.part2 = part2;
