const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.18.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map(makeTree);
}

function makeTree(value, parent, side) {
  if (isNaN(value)) {
    const tree = {
      parent: parent || null,
      side: side || null,
      value: null,
    };

    const { left, right } = getParts(value);

    tree.left = makeTree(left, tree, "L");
    tree.right = makeTree(right, tree, "R");

    return tree;
  } else {
    return buildLeaf(Number(value), parent, side);
  }
}

function getParts(value) {
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

function buildLeaf(value, parent, side) {
  return {
    parent,
    left: null,
    right: null,
    side,
    value,
  };
}

function part1() {
  const input = parseInput();

  const sum = input.slice(1).reduce((sum, number) => {
    const newSum = {
      parent: null,
      side: null,
      value: null,
    };

    sum.parent = newSum;
    sum.side = "L";
    newSum.left = sum;

    number.parent = newSum;
    number.side = "R";
    newSum.right = number;

    let shouldReduce = true;

    while (shouldReduce) {
      // NOTE - Handle explosions.

      if (explode(newSum)) {
        continue;
      }

      // NOTE - Handle split.

      if (split(newSum)) {
        continue;
      }

      shouldReduce = false;
    }

    return newSum;
  }, input[0]);

  return magnitude(sum);
}

function explode(element, depth = 0) {
  if (element.value !== null) {
    return false;
  }

  if (depth > 3) {
    const leftValue = element.left.value;
    updateValue(element.left, leftValue);

    const rightValue = element.right.value;
    updateValue(element.right, rightValue);

    if (element.side === "L") {
      element.value = 0;
      element.left = null;
      element.right = null;
    }

    if (element.side === "R") {
      element.value = 0;
      element.left = null;
      element.right = null;
    }

    return true;
  }

  return explode(element.left, depth + 1) || explode(element.right, depth + 1);
}

function split(element) {
  if (element.value !== null) {
    if (element.value > 9) {
      const leftValue = Math.floor(element.value / 2);
      const rightValue = Math.ceil(element.value / 2);

      const node = {
        parent: element.parent,
        side: element.side,
        value: null,
      };

      node.left = buildLeaf(leftValue, node, "L");
      node.right = buildLeaf(rightValue, node, "R");

      if (element.side === "L") {
        element.parent.left = node;
      }

      if (element.side === "R") {
        element.parent.right = node;
      }

      return true;
    }

    return false;
  }

  return split(element.left) || split(element.right);
}

function updateValue(element, value) {
  let current = element;

  while (true) {
    if (current.side !== (current.parent.side || current.side)) {
      break;
    }

    current = current.parent;

    if (!current.parent) {
      return;
    }
  }

  if (current.side === "L") {
    const first = getLastElement(current.parent.parent.left);
    first.value += value;
  }

  if (current.side === "R") {
    const last = getFirstElement(current.parent.parent.right);
    last.value += value;
  }
}

function getFirstElement(root) {
  let current = root;

  while (current.value === null) {
    current = current.left;
  }

  return current;
}

function getLastElement(root) {
  let current = root;

  while (current.value === null) {
    current = current.right;
  }

  return current;
}

function print(root) {
  if (root.value !== null) {
    return root.value;
  }

  return `[${print(root.left)},${print(root.right)}]`;
}

function magnitude(element) {
  if (element.value !== null) {
    return element.value;
  }

  return 3 * magnitude(element.left) + 2 * magnitude(element.right);
}

function part2() {
  const input = parseInput();

  let max = 0;

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input.length; j++) {
      const newInput = parseInput();

      if (i === j) {
        continue;
      }

      const one = calculateSum(newInput[i], newInput[j]);

      if (one > max) {
        max = one;
      }
      const newInput2 = parseInput();
      const two = calculateSum(newInput2[j], newInput2[i]);

      if (two > max) {
        max = two;
      }
    }
  }

  return max;
}

function calculateSum(x, y) {
  const newSum = {
    parent: null,
    side: null,
    value: null,
  };

  x.parent = newSum;
  x.side = "L";
  newSum.left = x;

  y.parent = newSum;
  y.side = "R";
  newSum.right = y;

  let shouldReduce = true;

  while (shouldReduce) {
    // NOTE - Handle explosions.

    if (explode(newSum)) {
      continue;
    }

    // NOTE - Handle split.

    if (split(newSum)) {
      continue;
    }

    shouldReduce = false;
  }

  return magnitude(newSum);
}

module.exports.part1 = part1;
module.exports.part2 = part2;
