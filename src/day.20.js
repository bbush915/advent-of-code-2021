const fs = require("fs");

const { clone } = require("./utils/misc");

function parseInput() {
  const parts = fs.readFileSync("src/day.20.input.txt", "utf-8").split("\n\n");

  const algorithm = parts[0];

  const image = parts[1]
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  return {
    algorithm,
    image,
  };
}

function part1() {
  const { algorithm, image } = parseInput();

  const enhancedImage = getEnhancedImage(algorithm, image, 2);

  return enhancedImage.flatMap((x) => x).filter((x) => x === "#").length;
}

function part2() {
  const { algorithm, image } = parseInput();

  const enhancedImage = getEnhancedImage(algorithm, image, 50);

  return enhancedImage.flatMap((x) => x).filter((x) => x === "#").length;
}

function getEnhancedImage(algorithm, image, steps) {
  const enhancedImage = clone(image);

  for (let step = 0; step < steps; step++) {
    expandImage(enhancedImage, step % 2 === 0 ? "." : "#");

    const snapshot = clone(enhancedImage);

    for (let i = 1; i < enhancedImage.length - 1; i++) {
      for (let j = 1; j < enhancedImage.length - 1; j++) {
        const outputKey = (
          snapshot[i - 1][j - 1] +
          snapshot[i - 1][j] +
          snapshot[i - 1][j + 1] +
          snapshot[i][j - 1] +
          snapshot[i][j] +
          snapshot[i][j + 1] +
          snapshot[i + 1][j - 1] +
          snapshot[i + 1][j] +
          snapshot[i + 1][j + 1]
        )
          .replace(/\./g, "0")
          .replace(/\#/g, "1");

        enhancedImage[i][j] = algorithm[parseInt(outputKey, 2)];
      }
    }

    cropImage(enhancedImage);
  }

  return enhancedImage;
}

function expandImage(image, character) {
  const size = image.length;

  image.splice(0, 0, new Array(size + 4).fill(character), new Array(size + 4).fill(character));

  for (let i = 2; i < image.length; i++) {
    image[i].splice(0, 0, character, character);
    image[i].push(character, character);
  }

  image.push(new Array(size + 4).fill(character), new Array(size + 4).fill(character));
}

function cropImage(image) {
  image.shift();

  for (let i = 0; i < image.length - 1; i++) {
    image[i].shift();
    image[i].pop();
  }

  image.pop();
}

module.exports.part1 = part1;
module.exports.part2 = part2;
