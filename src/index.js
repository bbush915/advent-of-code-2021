(function () {
  if (process.argv[2]) {
    const day = process.argv[2];
    executeDay(day);
  } else {
    for (let i = 0; i < 25; i++) {
      if (i > 0) {
        console.log();
      }

      const day = (i + 1).toString();
      executeDay(day);
    }
  }
})();

function executeDay(day) {
  const { part1, part2 } = require(`./day.${day}`);

  console.info(`----- Day ${day} -----`);

  const { result: p1Answer, timeElapsed: p1TimeElapsed } = executePart(part1);
  console.info(`Part 1: ${p1Answer} [${p1TimeElapsed} ms]`);

  const { result: p2Answer, timeElapsed: p2TimeElapsed } = executePart(part2);
  console.info(`Part 2: ${p2Answer} [${p2TimeElapsed} ms]`);
}

function executePart(part) {
  const start = new Date().getTime();

  const result = part();

  return { result, timeElapsed: new Date().getTime() - start };
}
