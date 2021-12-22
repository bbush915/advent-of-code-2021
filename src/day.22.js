const fs = require("fs");

const { clone } = require("./utils/misc");

function parseInput() {
  return fs
    .readFileSync("src/day.22.input.txt", "utf-8")
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");

      const toggle = parts[0];

      const boundParts = parts[1].split(",");

      return {
        toggle,
        minX: Number(boundParts[0].slice(2).split("..")[0]),
        maxX: Number(boundParts[0].slice(2).split("..")[1]),
        minY: Number(boundParts[1].slice(2).split("..")[0]),
        maxY: Number(boundParts[1].slice(2).split("..")[1]),
        minZ: Number(boundParts[2].slice(2).split("..")[0]),
        maxZ: Number(boundParts[2].slice(2).split("..")[1]),
      };
    });
}

function part1() {
  const procedure = parseInput();

  const grid = [];

  for (let i = 0; i < 101; i++) {
    const planes = [];

    for (let j = 0; j < 101; j++) {
      planes.push(new Array(101).fill(0));
    }

    grid.push(planes);
  }

  for (const step of procedure) {
    const { toggle, minX, maxX, minY, maxY, minZ, maxZ } = step;

    if (minX < -50 || maxX > 50 || minY < -50 || maxY > 50 || minZ < -50 || maxZ > 50) {
      continue;
    }

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          grid[x + 50][y + 50][z + 50] = toggle === "on" ? 1 : 0;
        }
      }
    }
  }

  return grid.flatMap((x) => x.flatMap((x) => x)).reduce((sum, value) => (sum += value), 0);
}

function part2() {
  const procedure = parseInput();

  const cuboids = [];

  while (procedure.length > 0) {
    const step = procedure.shift();

    const newCuboids = [clone(step)];

    for (let i = cuboids.length - 1; i >= 0; i--) {
      for (let j = newCuboids.length - 1; j >= 0; j--) {
        const intersection = intersect(newCuboids[j], cuboids[i]);

        if (intersection) {
          if (step.toggle === "on") {
            const remainingCuboids = explode(newCuboids[j], intersection);
            newCuboids.splice(j, 1, ...remainingCuboids);
          }

          if (step.toggle === "off") {
            const remainingCuboids = explode(cuboids[i], intersection);
            cuboids.splice(i, 1, ...remainingCuboids);
          }
        }
      }
    }

    if (step.toggle === "on") {
      cuboids.push(...newCuboids);
    }
  }

  //2758514936282235

  return cuboids.reduce((sum, cuboid) => (sum += volume(cuboid)), 0);
}

function intersect(a, b) {
  const doesOverlapX =
    (a.minX >= b.minX && a.minX <= b.maxX) || (b.minX >= a.minX && b.minX <= a.maxX);
  const doesOverlapY =
    (a.minY >= b.minY && a.minY <= b.maxY) || (b.minY >= a.minY && b.minY <= a.maxY);
  const doesOverlapZ =
    (a.minZ >= b.minZ && a.minZ <= b.maxZ) || (b.minZ >= a.minZ && b.minZ <= a.maxZ);

  if (!doesOverlapX || !doesOverlapY || !doesOverlapZ) {
    return null;
  }

  return {
    minX: Math.max(a.minX, b.minX),
    maxX: Math.min(a.maxX, b.maxX),
    minY: Math.max(a.minY, b.minY),
    maxY: Math.min(a.maxY, b.maxY),
    minZ: Math.max(a.minZ, b.minZ),
    maxZ: Math.min(a.maxZ, b.maxZ),
  };
}

function explode(a, b) {
  if (
    a.minX === b.minX &&
    a.maxX === b.maxX &&
    a.minY === b.minY &&
    a.maxY === b.maxY &&
    a.minZ === b.minZ &&
    a.maxZ === b.maxZ
  ) {
    return [];
  }

  const pieces = [];

  const xCuts = [...new Set([a.minX, a.maxX + 1, b.minX, b.maxX + 1]).values()].sort(
    (x, y) => x - y
  );
  const yCuts = [...new Set([a.minY, a.maxY + 1, b.minY, b.maxY + 1]).values()].sort(
    (x, y) => x - y
  );
  const zCuts = [...new Set([a.minZ, a.maxZ + 1, b.minZ, b.maxZ + 1]).values()].sort(
    (x, y) => x - y
  );

  for (let i = 0; i < xCuts.length - 1; i++) {
    for (let j = 0; j < yCuts.length - 1; j++) {
      for (let k = 0; k < zCuts.length - 1; k++) {
        const minX = xCuts[i];
        const maxX = xCuts[i + 1] - 1;
        const minY = yCuts[j];
        const maxY = yCuts[j + 1] - 1;
        const minZ = zCuts[k];
        const maxZ = zCuts[k + 1] - 1;

        if (
          minX === b.minX &&
          maxX === b.maxX &&
          minY === b.minY &&
          maxY === b.maxY &&
          minZ === b.minZ &&
          maxZ === b.maxZ
        ) {
          continue;
        }

        pieces.push({
          minX,
          maxX,
          minY,
          maxY,
          minZ,
          maxZ,
        });
      }
    }
  }

  return pieces;
}

function volume(a) {
  return (a.maxX - a.minX + 1) * (a.maxY - a.minY + 1) * (a.maxZ - a.minZ + 1);
}

module.exports.part1 = part1;
module.exports.part2 = part2;
