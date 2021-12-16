const { MinPriorityQueue } = require("./priority-queue");

function dijkstra({ getNeighbors, getDistance }, source, target) {
  const distanceLookup = new Map();
  distanceLookup.set(source, 0);

  const predecessorLookup = new Map();
  predecessorLookup.set(source, undefined);

  const priorityQueue = new MinPriorityQueue();
  priorityQueue.insert(source, distanceLookup.get(source));

  while (priorityQueue.size > 0) {
    const { key } = priorityQueue.pop();

    if (key === target) {
      break;
    }

    for (const neighborKey of getNeighbors(key)) {
      const distance = distanceLookup.get(key) + getDistance(key, neighborKey);

      if (distance < (distanceLookup.get(neighborKey) || Number.POSITIVE_INFINITY)) {
        distanceLookup.set(neighborKey, distance);
        predecessorLookup.set(neighborKey, key);

        if (priorityQueue.includes(neighborKey)) {
          priorityQueue.update(neighborKey, distance);
        } else {
          priorityQueue.insert(neighborKey, distance);
        }
      }
    }
  }

  return { distanceLookup, predecessorLookup };
}

module.exports = {
  dijkstra,
};
