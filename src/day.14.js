const fs = require("fs");

const { clone } = require("../src/utils/misc");

function parseInput() {
  const parts = fs.readFileSync("src/day.14.input.txt", "utf-8").split("\n\n");

  const template = parts[0].split("");

  const rules = parts[1]
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" -> "))
    .reduce((rules, [pair, insertion]) => {
      rules[pair] = {
        insertion,
        counts: getCounts(insertion.split("")),
      };

      return rules;
    }, {});

  return {
    template,
    rules,
  };
}

function part1() {
  return getDifference(4);
}

function part2() {
  return getDifference(6);
}

function getDifference(depth) {
  const { template, rules } = parseInput();

  const iteratedRuleCounts = getIteratedRuleCounts(rules, depth);

  const counts = getCounts(template);

  for (let i = 0; i < template.length - 1; i++) {
    const pair = template[i] + template[i + 1];

    if (iteratedRuleCounts[pair]) {
      mergeCounts(counts, iteratedRuleCounts[pair]);
    }
  }

  const sorted = Object.values(counts).sort((x, y) => x - y);

  return sorted[sorted.length - 1] - sorted[0];
}

function getIteratedRuleCounts(rules, depth) {
  let iteratedRules = clone(rules);

  for (let iteration = 0; iteration < depth; iteration++) {
    const nextIteratedRules = {};

    for (const [pair, { insertion, counts }] of Object.entries(iteratedRules)) {
      const newInsertion = insertion.split("");

      newInsertion.splice(0, 0, pair[0]);
      newInsertion.splice(newInsertion.length, 0, pair[1]);

      const newCounts = clone(counts);

      const insertions = [];

      for (let i = 0; i < newInsertion.length - 1; i++) {
        const pair = newInsertion[i] + newInsertion[i + 1];

        if (iteratedRules[pair]) {
          insertions.push([i + 1, iteration === 2 ? rules[pair] : iteratedRules[pair]]);
        }
      }

      for (const [index, { insertion, counts }] of insertions.reverse()) {
        if (iteration < depth - 1) {
          newInsertion.splice(index, 0, insertion);
        }

        mergeCounts(newCounts, counts);
      }

      nextIteratedRules[pair] = {
        insertion: newInsertion.slice(1, newInsertion.length - 1).join(""),
        counts: newCounts,
      };
    }

    iteratedRules = nextIteratedRules;
  }

  return Object.entries(iteratedRules).reduce((iteratedRuleCounts, [pair, { counts }]) => {
    iteratedRuleCounts[pair] = counts;
    return iteratedRuleCounts;
  }, {});
}

function getCounts(value) {
  return value.reduce((counts, element) => {
    if (!counts[element]) {
      counts[element] = 0;
    }

    counts[element]++;

    return counts;
  }, {});
}

function mergeCounts(x, y) {
  return Object.entries(y).reduce((counts, [element, count]) => {
    if (!counts[element]) {
      counts[element] = 0;
    }

    counts[element] += count;

    return counts;
  }, x);
}

module.exports.part1 = part1;
module.exports.part2 = part2;
