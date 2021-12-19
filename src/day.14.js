const fs = require("fs");

function parseInput() {
  const parts = fs.readFileSync("src/day.14.input.txt", "utf-8").split("\n\n");

  const template = parts[0];

  const rules = parts[1]
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" -> "))
    .reduce((rules, [pair, insertion]) => {
      rules.set(pair, insertion);
      return rules;
    }, new Map());

  return {
    template,
    rules,
  };
}

function part1() {
  return getDifference(10);
}

function part2() {
  return getDifference(40);
}

function getDifference(maxSteps) {
  const { template, rules } = parseInput();

  const elementCounts = new Map();

  for (const element of template) {
    elementCounts.set(element, (elementCounts.get(element) || 0) + 1);
  }

  let pairCounts = new Map();

  for (let i = 0; i < template.length - 1; i++) {
    const key = template[i] + template[i + 1];
    pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
  }

  for (let step = 0; step < maxSteps; step++) {
    const newPairCounts = new Map();

    for (const [key, value] of pairCounts) {
      const insertion = rules.get(key);
      elementCounts.set(insertion, (elementCounts.get(insertion) || 0) + value);

      const leftKey = key[0] + insertion;
      newPairCounts.set(leftKey, (newPairCounts.get(leftKey) || 0) + value);

      const rightKey = insertion + key[1];
      newPairCounts.set(rightKey, (newPairCounts.get(rightKey) || 0) + value);
    }

    pairCounts = newPairCounts;
  }

  const sortedElementCounts = Array.from(elementCounts.values()).sort((x, y) => x - y);
  return sortedElementCounts[sortedElementCounts.length - 1] - sortedElementCounts[0];
}

module.exports.part1 = part1;
module.exports.part2 = part2;
