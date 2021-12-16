const fs = require("fs");

function parseInput() {
  return fs
    .readFileSync("src/day.16.input.txt", "utf-8")
    .split("")
    .slice(0, -1)
    .flatMap((x) => parseInt(x, 16).toString(2).padStart(4, "0").split(""));
}

function part1() {
  const tranmission = parseInput();

  const { packet } = consumePacket(tranmission);

  return sumVersions([packet]);
}

function part2() {
  const tranmission = parseInput();

  const { packet } = consumePacket(tranmission);

  return evaluatePacket(packet);
}

function consumePacket(transmission) {
  let totalBitsConsumed = 0;

  const version = getValue(consumeBits(transmission, 3));
  totalBitsConsumed += 3;

  const typeId = getValue(consumeBits(transmission, 3));
  totalBitsConsumed += 3;

  let packet = {
    version,
    typeId,
  };

  if (typeId === 4) {
    const { literal, totalBitsConsumed: bitsConsumed } = consumeLiteral(transmission);
    totalBitsConsumed += bitsConsumed;

    packet.literal = literal;
  } else {
    const lengthTypeId = getValue(consumeBits(transmission, 1));
    totalBitsConsumed += 1;

    const subpackets = [];

    switch (lengthTypeId) {
      case 0: {
        const totalLength = getValue(consumeBits(transmission, 15));
        totalBitsConsumed += 15 + totalLength;

        let currentLength = 0;

        while (currentLength < totalLength) {
          const { packet: subpacket, totalBitsConsumed: bitsConsumed } =
            consumePacket(transmission);
          currentLength += bitsConsumed;

          subpackets.push(subpacket);
        }

        break;
      }

      case 1: {
        const subpacketCount = getValue(consumeBits(transmission, 11));
        totalBitsConsumed += 11;

        for (let i = 0; i < subpacketCount; i++) {
          const { packet: subpacket, totalBitsConsumed: bitsConsumed } =
            consumePacket(transmission);
          totalBitsConsumed += bitsConsumed;

          subpackets.push(subpacket);
        }

        break;
      }
    }

    packet.subpackets = subpackets;
  }

  return {
    packet,
    totalBitsConsumed,
  };
}

function consumeLiteral(transmission) {
  let totalBitsConsumed = 0;

  const literalBits = [];

  while (true) {
    const group = consumeBits(transmission, 5);
    totalBitsConsumed += 5;

    literalBits.push(...group.slice(1));

    if (group[0] === "0") {
      break;
    }
  }

  return { literal: getValue(literalBits), totalBitsConsumed };
}

function consumeBits(transmission, count) {
  return transmission.splice(0, count);
}

function getValue(bits) {
  return parseInt(bits.join(""), 2);
}

function sumVersions(packets) {
  let sum = 0;

  for (const packet of packets) {
    sum += packet.version;

    if (packet.subpackets) {
      sum += sumVersions(packet.subpackets);
    }
  }

  return sum;
}

function evaluatePacket({ typeId, literal, subpackets }) {
  switch (typeId) {
    case 0: {
      return subpackets.reduce((sum, subpacket) => (sum += evaluatePacket(subpacket)), 0);
    }

    case 1: {
      return subpackets.reduce((product, subpacket) => (product *= evaluatePacket(subpacket)), 1);
    }

    case 2: {
      return Math.min(...subpackets.map((x) => evaluatePacket(x)));
    }

    case 3: {
      return Math.max(...subpackets.map((x) => evaluatePacket(x)));
    }

    case 4: {
      return literal;
    }

    case 5: {
      return evaluatePacket(subpackets[0]) > evaluatePacket(subpackets[1]) ? 1 : 0;
    }

    case 6: {
      return evaluatePacket(subpackets[0]) < evaluatePacket(subpackets[1]) ? 1 : 0;
    }

    case 7: {
      return evaluatePacket(subpackets[0]) === evaluatePacket(subpackets[1]) ? 1 : 0;
    }
  }
}

module.exports.part1 = part1;
module.exports.part2 = part2;
