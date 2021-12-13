const fs = require("fs");

function parseInput() {
  const parts = fs.readFileSync("src/day.13.input.txt", "utf-8").split("\n\n");

  const dots = parts[0].split("\n").map((x) => x.split(",").map(Number));

  const folds = parts[1]
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split("=");

      return {
        direction: parts[0][parts[0].length - 1],
        value: Number(parts[1]),
      };
    });

  return {
    paper: initializePaper(dots),
    folds,
  };
}

function initializePaper(dots) {
  const boundX = Math.max(...dots.map((x) => x[0])) + 1;
  const boundY = Math.max(...dots.map((x) => x[1])) + 1;

  const paper = new Array(boundY);

  for (let i = 0; i < boundY; i++) {
    paper[i] = new Array(boundX).fill(".");
  }

  // NOTE - Mark dots.

  for (let i = 0; i < dots.length; i++) {
    paper[dots[i][1]][dots[i][0]] = "#";
  }

  return paper;
}

function part1() {
  let { paper, folds } = parseInput();

  // NOTE - Apply first fold only.

  const { value } = folds[0];

  paper = foldX(paper, value);

  return paper.flatMap((x) => x).filter((x) => x === "#").length;
}

function part2() {
  let { paper, folds } = parseInput();

  // NOTE - Apply all folds.

  for (const { direction, value } of folds) {
    switch (direction) {
      case "x": {
        paper = foldX(paper, value);
        break;
      }

      case "y": {
        paper = foldY(paper, value);
        break;
      }
    }
  }

  return "\n\n" + paper.map((x) => x.join("")).join("\n") + "\n\n";
}

function foldX(paper, value) {
  const foldedPaper = new Array(paper.length);

  for (let y = 0; y < foldedPaper.length; y++) {
    foldedPaper[y] = new Array(value).fill(".");
  }

  for (let y = 0; y < foldedPaper.length; y++) {
    for (let x = 0; x < foldedPaper[y].length; x++) {
      const reflectX = 2 * value - x;
      foldedPaper[y][x] = paper[y][x] === "#" || (paper[y][reflectX] || ".") === "#" ? "#" : ".";
    }
  }

  return foldedPaper;
}

function foldY(paper, value) {
  const foldedPaper = new Array(value);

  for (let y = 0; y < foldedPaper.length; y++) {
    foldedPaper[y] = new Array(paper[0].length).fill(".");
  }

  for (let y = 0; y < foldedPaper.length; y++) {
    for (let x = 0; x < foldedPaper[y].length; x++) {
      const reflectY = 2 * value - y;
      foldedPaper[y][x] =
        paper[y][x] === "#" || (paper[reflectY] ? paper[reflectY][x] : ".") === "#" ? "#" : ".";
    }
  }

  return foldedPaper;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
