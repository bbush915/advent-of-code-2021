const fs = require("fs");

const { clone, isNumeric } = require("./utils/misc");

function parseInput() {
  return fs
    .readFileSync("src/day.18.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map(buildSnailfishNumber);
}

function buildSnailfishNumber(value) {
  if (isNumeric(value)) {
    return {
      left: null,
      right: null,
      value: Number(value),
    };
  }

  const { left, right } = splitPair(value);

  return {
    left: buildSnailfishNumber(left),
    right: buildSnailfishNumber(right),
    value: null,
  };
}

function splitPair(value) {
  const trimmedValue = value.slice(1, -1);

  let count = 0;

  for (let i = 0; i < trimmedValue.length; i++) {
    if (trimmedValue[i] === "[") {
      count++;
    }

    if (trimmedValue[i] === "]") {
      count--;
    }

    if (count == 0) {
      return {
        left: trimmedValue.slice(0, i + 1),
        right: trimmedValue.slice(i + 2),
      };
    }
  }
}

function part1() {
  const snailfishNumbers = parseInput();

  const finalSum = snailfishNumbers
    .slice(1)
    .reduce((currentSum, snailfishNumber) => add(currentSum, snailfishNumber), snailfishNumbers[0]);

  return magnitude(finalSum);
}

function part2() {
  const snailfishNumbers = parseInput();

  let maxMagnitude = 0;

  for (let i = 0; i < snailfishNumbers.length; i++) {
    for (let j = i + 1; j < snailfishNumbers.length; j++) {
      const magnitude1 = magnitude(add(snailfishNumbers[i], snailfishNumbers[j]));

      if (magnitude1 > maxMagnitude) {
        maxMagnitude = magnitude1;
      }

      const magnitude2 = magnitude(add(snailfishNumbers[j], snailfishNumbers[i]));

      if (magnitude2 > maxMagnitude) {
        maxMagnitude = magnitude2;
      }
    }
  }

  return maxMagnitude;
}

function add(x, y) {
  const sum = {
    left: clone(x),
    right: clone(y),
    value: null,
  };

  return reduce(sum);
}

function reduce(snailfishNumber) {
  let shouldReduce = true;

  while (shouldReduce) {
    if (explode(snailfishNumber, snailfishNumber)) {
      continue;
    }

    if (split(snailfishNumber)) {
      continue;
    }

    shouldReduce = false;
  }

  return snailfishNumber;
}

function explode(snailfishNumber, element, depth = 0) {
  if (element.value !== null) {
    return false;
  }

  if (depth > 3) {
    const leftValue = element.left.value;
    const rightValue = element.right.value;

    element.left = null;
    element.right = null;
    element.value = 0;

    const { left, right } = getNeighbors(snailfishNumber, element);

    if (left) {
      left.value += leftValue;
    }

    if (right) {
      right.value += rightValue;
    }

    return true;
  }

  return (
    explode(snailfishNumber, element.left, depth + 1) ||
    explode(snailfishNumber, element.right, depth + 1)
  );
}

function getNeighbors(snailfishNumber, element) {
  const values = [];
  getNeighborsHelper(snailfishNumber, element, values);

  const index = values.findIndex((x) => x === element);

  return {
    left: values[index - 1],
    right: values[index + 1],
  };
}

function getNeighborsHelper(current, element, values) {
  if (current === null) {
    return;
  }

  getNeighborsHelper(current.left, element, values);

  if (current.value !== null) {
    values.push(current);
  }

  getNeighborsHelper(current.right, element, values);
}

function split(element) {
  if (element.value !== null) {
    if (element.value > 9) {
      element.left = {
        left: null,
        right: null,
        value: Math.floor(element.value / 2),
      };

      element.right = {
        left: null,
        right: null,
        value: Math.ceil(element.value / 2),
      };

      element.value = null;

      return true;
    }

    return false;
  }

  return split(element.left) || split(element.right);
}

function magnitude(element) {
  if (element.value !== null) {
    return element.value;
  }

  return 3 * magnitude(element.left) + 2 * magnitude(element.right);
}

module.exports.part1 = part1;
module.exports.part2 = part2;
