const fs = require("fs");

const { clone } = require("./utils/misc");

const LOCATION_MAP = {
  HALLWAY: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
};

const ENERGY_MAP = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

function parseInput(isPartTwo) {
  const lines = fs.readFileSync("src/day.23.input.txt", "utf-8").split("\n");

  if (isPartTwo) {
    lines.splice(3, 0, "  #D#C#B#A#  ", "  #D#B#A#C#  ");
  }

  const diagram = [null, [], [], [], []];

  diagram[LOCATION_MAP.HALLWAY] = new Array(11).fill(null);

  for (let i = 2; i < lines.length - 1; i++) {
    diagram[LOCATION_MAP.A].push(lines[i][3]);
    diagram[LOCATION_MAP.B].push(lines[i][5]);
    diagram[LOCATION_MAP.C].push(lines[i][7]);
    diagram[LOCATION_MAP.D].push(lines[i][9]);
  }

  return {
    diagram,
    permissibleMoves: getPermissibleMoves(diagram),
  };
}

function getPermissibleMoves(diagram) {
  const permissibleMoves = [];

  // NOTE - Hallway <-> Room

  for (
    let hallwayPosition = 0;
    hallwayPosition < diagram[LOCATION_MAP.HALLWAY].length;
    hallwayPosition++
  ) {
    // NOTE - Skip spaces immediately outside a Room.

    if ([2, 4, 6, 8].includes(hallwayPosition)) {
      continue;
    }

    for (const location of Object.values(LOCATION_MAP)) {
      if (location === LOCATION_MAP.HALLWAY) {
        continue;
      }

      for (let roomPosition = 0; roomPosition < diagram[location].length; roomPosition++) {
        const source = { location: LOCATION_MAP.HALLWAY, position: hallwayPosition };
        const target = { location, position: roomPosition };

        const move = {
          from: source,
          to: target,
          distance: getDistance(source, target),
        };

        permissibleMoves.push(move);
      }
    }
  }

  // NOTE - Room <-> Room

  for (let i = LOCATION_MAP.A; i <= LOCATION_MAP.D; i++) {
    for (let j = i + 1; j <= LOCATION_MAP.D; j++) {
      for (let x = 0; x < diagram[i].length; x++) {
        for (let y = 0; y < diagram[j].length; y++) {
          const source = { location: i, position: x };
          const target = { location: j, position: y };

          const move = {
            from: source,
            to: target,
            distance: getDistance(source, target),
          };

          permissibleMoves.push(move);
        }
      }
    }
  }

  return permissibleMoves;
}

function getDistance(source, target) {
  let distance = 0;

  if (source.location === target.location && source.location !== LOCATION_MAP.HALLWAY) {
    return Math.abs(target.position - source.position);
  }

  if (source.location !== LOCATION_MAP.HALLWAY) {
    distance += source.position + 1;
  }

  const sourcePosition =
    source.location === LOCATION_MAP.HALLWAY ? source.position : 2 * source.location;
  const targetPosition =
    target.location === LOCATION_MAP.HALLWAY ? target.position : 2 * target.location;

  distance += Math.abs(targetPosition - sourcePosition);

  if (target.location !== LOCATION_MAP.HALLWAY) {
    distance += target.position + 1;
  }

  return distance;
}

function part1() {
  const { diagram, permissibleMoves } = parseInput(false);

  // NOTE - Found via hand solution.
  let initialMinimumEnergy = 15162;

  return getMinimumEnergy(diagram, permissibleMoves, initialMinimumEnergy);
}

function part2() {
  const { diagram, permissibleMoves } = parseInput(true);
  return getMinimumEnergy(diagram, permissibleMoves);
}

function getMinimumEnergy(
  diagram,
  permissibleMoves,
  initialMinimumEnergy = Number.POSITIVE_INFINITY
) {
  const stack = [];
  const history = [];

  let stack0 = 0;
  let stack1 = 0;
  let stack2 = 0;

  let currentEnergy = 0;
  let minimumEnergy = initialMinimumEnergy;

  mainLoop: while (1) {
    const newStack0 = stack[0] ? stack[0].length : 0;
    const newStack1 = stack[1] ? stack[1].length : 0;
    const newStack2 = stack[2] ? stack[2].length : 0;

    if (newStack0 !== stack0 || newStack1 !== stack1 || newStack2 !== stack2) {
      console.log("Stack: " + newStack0 + " | " + newStack1 + " | " + newStack2);
      stack0 = newStack0;
      stack1 = newStack1;
      stack2 = newStack2;
    }

    if (isOrganized(diagram) && currentEnergy < minimumEnergy) {
      minimumEnergy = currentEnergy;
      console.debug(minimumEnergy);
    }

    let possibleMoves = getPossibleMoves(diagram, permissibleMoves, currentEnergy, minimumEnergy);

    if (possibleMoves.length == 0) {
      backtrackLoop: while (1) {
        if (history.length === 0) {
          break mainLoop;
        }

        // NOTE - Reverse previous move.

        const previousMove = history.pop();
        previousMove.mirror = !previousMove.mirror;

        executedMove(diagram, previousMove);

        currentEnergy -= getEnergy(previousMove);

        // NOTE - Update stack.

        possibleMoves = stack[stack.length - 1];

        if (possibleMoves.length === 0) {
          stack.pop();
        } else {
          break backtrackLoop;
        }
      }
    } else {
      stack.push(possibleMoves);
    }

    const move = possibleMoves.pop();
    history.push(move);

    executedMove(diagram, move);

    currentEnergy += getEnergy(move);
  }

  return minimumEnergy;
}

function isOrganized(diagram) {
  return (
    diagram[LOCATION_MAP.A].every((space) => space === "A") &&
    diagram[LOCATION_MAP.B].every((space) => space === "B") &&
    diagram[LOCATION_MAP.C].every((space) => space === "C") &&
    diagram[LOCATION_MAP.D].every((space) => space === "D")
  );
}

function getPossibleMoves(diagram, permissibleMoves, currentEnergy, minimumEnergy) {
  const possibleMoves = [];

  const amphipods = diagram
    .flatMap((x, location) => x.map((x, position) => ({ type: x, location, position })))
    .filter((x) => x.type);

  for (const amphipod of amphipods) {
    for (const move of permissibleMoves) {
      const { from, to } = move;

      if (
        from.location === amphipod.location &&
        from.position === amphipod.position &&
        canExecuteMove(diagram, from, to)
      ) {
        const moveContext = { amphipod, move, mirror: false };

        const moveDiagram = clone(diagram);
        executedMove(moveDiagram, moveContext);

        const totalEnergy =
          currentEnergy + getEnergy(moveContext) + getMinimumRequiredEnergy(moveDiagram);

        moveContext.totalEnergy = totalEnergy;

        possibleMoves.push(moveContext);
      }

      if (
        to.location === amphipod.location &&
        to.position === amphipod.position &&
        canExecuteMove(diagram, to, from)
      ) {
        const moveContext = { amphipod, move, mirror: true };

        const moveDiagram = clone(diagram);
        executedMove(moveDiagram, moveContext);

        const totalEnergy =
          currentEnergy + getEnergy(moveContext) + getMinimumRequiredEnergy(moveDiagram);

        moveContext.totalEnergy = totalEnergy;

        possibleMoves.push(moveContext);
      }
    }
  }

  return possibleMoves
    .filter((move) => move.totalEnergy < minimumEnergy)
    .sort((x, y) => y.totalEnergy - x.totalEnergy);
}

function canExecuteMove(diagram, from, to) {
  const amphipodType = diagram[from.location][from.position];

  if (diagram[to.location][to.position]) {
    return false;
  }

  // NOTE - Entering Room.

  if (to.location !== LOCATION_MAP.HALLWAY) {
    // NOTE - Wrong room.

    if (to.location !== LOCATION_MAP[amphipodType]) {
      return false;
    }

    // NOTE - Contains amphipod of another type.

    if (diagram[to.location].some((x) => x && x !== amphipodType)) {
      return false;
    }

    // NOTE - Not filling bottom-most spot when it is available.

    let firstNonEmptyPosition = diagram[to.location].findIndex((x) => x);

    if (firstNonEmptyPosition < 0) {
      firstNonEmptyPosition = diagram[to.location].length;
    }

    if (to.position < firstNonEmptyPosition - 1) {
      return false;
    }
  }

  // NOTE - Leaving Room.

  if (from.location !== LOCATION_MAP.HALLWAY) {
    // NOTE - Another amphipod is in the way in the room.

    if (diagram[from.location].some((x, i) => i < from.position && x)) {
      return false;
    }

    // NOTE - Don't leave correct room, unless we have to move for an amphipod of another type.

    if (
      from.location === LOCATION_MAP[amphipodType] &&
      diagram[from.location].every(
        (x, i) => i <= from.position || (i > from.position && x === amphipodType)
      )
    ) {
      return false;
    }
  }

  // NOTE - Hallway -> Room

  if (from.location === LOCATION_MAP.HALLWAY && to.location !== LOCATION_MAP.HALLWAY) {
    // NOTE - Another amphipod is in the way in the hallway.

    const minPosition = from.position < 2 * to.location ? from.position + 1 : 2 * to.location;
    const maxPosition = from.position < 2 * to.location ? 2 * to.location : from.position - 1;

    if (diagram[LOCATION_MAP.HALLWAY].some((x, i) => i >= minPosition && i <= maxPosition && x)) {
      return false;
    }
  }

  // NOTE - Room -> Hallway

  if (from.location !== LOCATION_MAP.HALLWAY && to.location === LOCATION_MAP.HALLWAY) {
    // NOTE - Another amphipod is in the way in the hallway.

    const minPosition = to.position < 2 * from.location ? to.position + 1 : 2 * from.location;
    const maxPosition = to.position < 2 * from.location ? 2 * from.location : to.position - 1;

    if (diagram[LOCATION_MAP.HALLWAY].some((x, i) => i >= minPosition && i <= maxPosition && x)) {
      return false;
    }
  }

  // NOTE - Room -> Room

  if (from.location !== LOCATION_MAP.HALLWAY && to.location !== LOCATION_MAP.HALLWAY) {
    // NOTE - Another amphipod is in the way in the hallway.

    const minPosition = to.location < from.location ? 2 * to.location : 2 * from.location;
    const maxPosition = to.location < from.location ? 2 * from.location : 2 * to.location;

    if (diagram[LOCATION_MAP.HALLWAY].some((x, i) => i >= minPosition && i <= maxPosition && x)) {
      return false;
    }
  }

  return true;
}

function executedMove(diagram, { amphipod: { type }, move: { to, from }, mirror }) {
  const actualTo = mirror ? from : to;
  const actualFrom = mirror ? to : from;

  // NOTE - Update old space.
  diagram[actualFrom.location][actualFrom.position] = null;

  // NOTE - Update new space.
  diagram[actualTo.location][actualTo.position] = type;
}

function getEnergy({ amphipod: { type }, move }) {
  return move ? ENERGY_MAP[type] * move.distance : 0;
}

function getMinimumRequiredEnergy(diagram) {
  let minimumRequiredEnergy = 0;

  const amphipods = diagram
    .flatMap((x, location) => x.map((x, position) => ({ type: x, location, position })))
    .filter((x) => x.type);

  for (const location of Object.values(LOCATION_MAP)) {
    if (location === LOCATION_MAP.HALLWAY) {
      continue;
    }

    const amphipodType = Object.entries(LOCATION_MAP).find((x) => x[1] === location)[0];
    const locationAmphipods = amphipods.filter(
      (x) => x.type === amphipodType && x.location !== location
    );

    for (let position = 0; position < diagram[location].length; position++) {
      if (diagram[location][position] === amphipodType) {
        continue;
      }

      const amphipod = locationAmphipods.pop();

      const energy = getDistance(amphipod, { location, position }) * ENERGY_MAP[amphipodType];

      minimumRequiredEnergy += energy;
    }
  }

  return minimumRequiredEnergy;
}

module.exports.part1 = part1;
module.exports.part2 = part2;
