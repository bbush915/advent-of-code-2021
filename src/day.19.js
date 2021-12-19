const fs = require("fs");

const { clone } = require("./utils/misc");

// NOTE - The following encodes each possible way to transform a point [x,y,z],
// such that we cover all 24 orientation possibilities. Specifically, each item
// gives the index (1-based) of each coordinate, along with a sign.

const ORIENTATION_TRANSFORMATIONS = [
  // NOTE - Positive X

  [1, 2, 3],
  [1, 3, -2],
  [1, -2, -3],
  [1, -3, 2],

  // NOTE - Negative X

  [-1, -2, 3],
  [-1, 3, 2],
  [-1, 2, -3],
  [-1, -3, -2],

  // NOTE - Positive Y

  [2, -1, 3],
  [2, 3, 1],
  [2, 1, -3],
  [2, -3, -1],

  // NOTE - Negative Y

  [-2, 1, 3],
  [-2, 3, -1],
  [-2, -1, -3],
  [-2, -3, 1],

  // NOTE - Positive Z

  [3, 2, -1],
  [3, -1, -2],
  [3, -2, 1],
  [3, 1, 2],

  // NOTE - Negative Z

  [-3, -2, -1],
  [-3, -1, 2],
  [-3, 2, 1],
  [-3, 1, -2],
];

function parseInput() {
  return fs
    .readFileSync("src/day.19.input.txt", "utf-8")
    .split("\n\n")
    .map((scanner) => ({
      beacons: scanner
        .split("\n")
        .slice(1)
        .filter((x) => x)
        .map((x) => x.split(",").map(Number)),
    }));
}

function part1() {
  const scanners = parseInput();

  const establishedScanners = establishScanners(scanners);

  return establishedScanners.reduce((beacons, scanner) => {
    for (const beacon of scanner.beacons) {
      const absoluteBeacon = [
        beacon[0] + scanner.location[0],
        beacon[1] + scanner.location[1],
        beacon[2] + scanner.location[2],
      ];

      beacons.add(absoluteBeacon.join("|"));
    }

    return beacons;
  }, new Set()).size;
}

function part2() {
  const scanners = parseInput();

  const establishedScanners = establishScanners(scanners);

  let maxDistance = 0;

  for (let i = 0; i < establishedScanners.length; i++) {
    for (let j = i + 1; j < establishedScanners.length; j++) {
      const distance =
        Math.abs(establishedScanners[i].location[0] - establishedScanners[j].location[0]) +
        Math.abs(establishedScanners[i].location[1] - establishedScanners[j].location[1]) +
        Math.abs(establishedScanners[i].location[2] - establishedScanners[j].location[2]);

      if (distance > maxDistance) {
        maxDistance = distance;
      }
    }
  }

  return maxDistance;
}

function establishScanners(scanners) {
  const baseScanner = scanners.shift();

  const establishedScanners = [];
  establishedScanners.push({ location: [0, 0, 0], beacons: baseScanner.beacons });

  while (scanners.length > 0) {
    for (const establishedScanner of establishedScanners) {
      for (let n = scanners.length - 1; n >= 0; n--) {
        const orientedScanners = getOrientedScanners(scanners[n]);

        for (const orientedScanner of orientedScanners) {
          const differenceCounts = new Map();

          for (let i = 0; i < establishedScanner.beacons.length; i++) {
            for (let j = 0; j < orientedScanner.beacons.length; j++) {
              const difference = [
                establishedScanner.beacons[i][0] - orientedScanner.beacons[j][0],
                establishedScanner.beacons[i][1] - orientedScanner.beacons[j][1],
                establishedScanner.beacons[i][2] - orientedScanner.beacons[j][2],
              ];

              const differenceKey = difference.join("|");
              differenceCounts.set(differenceKey, (differenceCounts.get(differenceKey) || 0) + 1);
            }
          }

          const sortedDifferenceCounts = Array.from(differenceCounts.entries()).sort(
            (x, y) => y[1] - x[1]
          );

          if (sortedDifferenceCounts[0][1] >= 12) {
            scanners.splice(n, 1);

            const difference = sortedDifferenceCounts[0][0].split("|").map(Number);

            const location = [
              difference[0] + establishedScanner.location[0],
              difference[1] + establishedScanner.location[1],
              difference[2] + establishedScanner.location[2],
            ];

            establishedScanners.push({
              location,
              beacons: orientedScanner.beacons,
            });
          }
        }
      }
    }
  }

  return establishedScanners;
}

function getOrientedScanners(scanner) {
  const orientedScanners = [];

  for (const transformation of ORIENTATION_TRANSFORMATIONS) {
    const orientedScanner = applyTransformation(scanner, transformation);
    orientedScanners.push(orientedScanner);
  }

  return orientedScanners;
}

function applyTransformation(scanner, transformation) {
  const transformedScanner = clone(scanner);

  for (const beacon of transformedScanner.beacons) {
    [beacon[0], beacon[1], beacon[2]] = [
      beacon[Math.abs(transformation[0]) - 1] * Math.sign(transformation[0]),
      beacon[Math.abs(transformation[1]) - 1] * Math.sign(transformation[1]),
      beacon[Math.abs(transformation[2]) - 1] * Math.sign(transformation[2]),
    ];
  }

  return transformedScanner;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
