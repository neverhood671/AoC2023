const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const range = require('../utils/range');
const input = readFileToString('input.txt');

const parseBrick = str => {
  const [start, end] = str.split('~');
  const [startX, startY, startZ] = start.split(',').map(n => parseInt(n)),
    [endX, endY, endZ] = end.split(',').map(n => parseInt(n));
  return {
    start: [startX, startY, startZ],
    end: [endX, endY, endZ],
  };
};

const getBricksAboveCurrent = (bricks, brickIndex) => {
  const bricksAbove = new Set();
  const brick = bricks[brickIndex];
  let brickAboveIndex = -1;

  if (isBrickVertical(brick)) {
    brickAboveIndex = getBrickIndexAboveCurrentCell(
      bricks,
      brick.start[0],
      brick.start[1],
      Math.max(brick.start[2], brick.end[2])
    );
    if (brickAboveIndex !== -1) bricksAbove.add(brickAboveIndex);
  } else {
    for (let y = brick.start[1]; y <= brick.end[1]; y++) {
      for (let x = brick.start[0]; x <= brick.end[0]; x++) {
        brickAboveIndex = getBrickIndexAboveCurrentCell(bricks, x, y, brick.start[2]);
        if (brickAboveIndex !== -1) bricksAbove.add(brickAboveIndex);
      }
    }
  }

  return Array.from(bricksAbove);
};

const getBrickIndexAboveCurrentCell = (bricks, currX, currY, currZ) => {
  return bricks.findIndex(b => {
    const xRange = range(Math.min(b.start[0], b.end[0]), Math.max(b.start[0], b.end[0])),
      yRange = range(Math.min(b.start[1], b.end[1]), Math.max(b.start[1], b.end[1]));

    if (
      xRange.includes(currX) &&
      yRange.includes(currY) &&
      Math.min(b.start[2], b.end[2]) === currZ + 1
    )
      return true;
  });
};

const isThereAnythingUnderCurrentCell = (bricks, currX, currY, currZ) => {
  const brickUnder = bricks.find(b => {
    const xRange = range(Math.min(b.start[0], b.end[0]), Math.max(b.start[0], b.end[0])),
      yRange = range(Math.min(b.start[1], b.end[1]), Math.max(b.start[1], b.end[1]));

    if (
      xRange.includes(currX) &&
      yRange.includes(currY) &&
      Math.max(b.start[2], b.end[2]) === currZ - 1
    )
      return true;
  });

  return brickUnder !== undefined;
};

const getBricksIndexInZLine = (bricks, z) =>
  bricks.reduce((acc, b, i) => {
    if (z >= b.start[2] && z <= b.end[2]) acc.push(i);
    return acc;
  }, []);

const isBrickVertical = brick => brick.start[0] === brick.end[0] && brick.start[1] === brick.end[1];

const canBrickFall = (bricks, brickIndex) => {
  const brick = bricks[brickIndex];
  if (Math.min(brick.start[2], brick.end[2]) <= 1) return false;
  if (isBrickVertical(brick)) {
    return !isThereAnythingUnderCurrentCell(
      bricks,
      brick.start[0],
      brick.start[1],
      Math.min(brick.start[2], brick.end[2])
    );
  }

  for (let y = brick.start[1]; y <= brick.end[1]; y++) {
    for (let x = brick.start[0]; x <= brick.end[0]; x++) {
      if (isThereAnythingUnderCurrentCell(bricks, x, y, brick.start[2])) return false;
    }
  }
  return true;
};

const fallBricks = bricks => {
  const maxZ = Math.max(...bricks.map(b => Math.max(b.start[2], b.end[2])));

  for (let z = 0; z <= maxZ; z++) {
    const brickInLine = getBricksIndexInZLine(bricks, z);
    if (brickInLine.length === 0) continue;
    brickInLine.forEach(brickIndex => {
      while (canBrickFall(bricks, brickIndex)) {
        bricks[brickIndex].start[2] = bricks[brickIndex].start[2] - 1;
        bricks[brickIndex].end[2] = bricks[brickIndex].end[2] - 1;
      }
    });
  }

  return bricks;
};

const createSpace = bricks => {
  const maxX = bricks.reduce((acc, curr) => Math.max(acc, curr.end[0]), 0),
    maxY = bricks.reduce((acc, curr) => Math.max(acc, curr.end[1]), 0),
    maxZ = bricks.reduce((acc, curr) => Math.max(acc, curr.end[2]), 0);

  const xRows = Array.from(Array(maxX + 1).keys()),
    yRows = Array.from(Array(maxY + 1).keys()),
    zRows = Array.from(Array(maxZ + 1).keys());

  return zRows.map(z => yRows.map(y => xRows.map(x => '.')));
};

const getDiffCoordinateIndex = (start, end) => {
  for (let i = 0; i < start.length; i++) {
    if (start[i] !== end[i]) return i;
  }
  return -1;
};

const populateSpace = (space, bricks) => {
  bricks.forEach((brick, brickIndex) => {
    const diffCoordinateIndex = getDiffCoordinateIndex(brick.start, brick.end);

    if (diffCoordinateIndex === -1) {
      space[brick.start[2]][brick.start[1]][brick.start[0]] = brickIndex;
    } else {
      for (let i = brick.start[diffCoordinateIndex]; i <= brick.end[diffCoordinateIndex]; i++) {
        if (diffCoordinateIndex === 2) {
          space[i][brick.start[1]][brick.start[0]] = brickIndex;
        } else if (diffCoordinateIndex === 1) {
          space[brick.start[2]][i][brick.start[0]] = brickIndex;
        } else {
          space[brick.start[2]][brick.start[1]][i] = brickIndex;
        }
      }
    }
  });

  return space;
};

const printSpaceY = space => {
  for (let z = space.length - 1; z >= 0; z--) {
    let line = '';
    for (let y = 0; y < space[z].length; y++) {
      const s = space[z][y].find(i => i !== '.');
      line += s === undefined ? '.' : s;
    }
    console.log(line);
  }
};

const printSpaceX = space => {
  for (let z = space.length - 1; z >= 0; z--) {
    let line = '';
    for (let x = 0; x < space[z][0].length; x++) {
      let s = '.';
      for (let y = 0; y < space[z].length; y++) {
        if (space[z][y][x] !== '.') s = space[z][y][x];
      }
      line += s;
    }
    console.log(line);
  }
};

const printSpace = bricks => {
  let space = createSpace(bricks);
  space = populateSpace(space, bricks);
  console.log(' X');
  printSpaceX(space);
  console.log('------- \n\n\n Y');
  printSpaceY(space);
};

const canBrickBeRemoved = (bricks, brickIndex) => {
  const bricksAbove = getBricksAboveCurrent(bricks, brickIndex);
  if (bricksAbove.length === 0) return true;

  const bricksWithoutCurrent = [...bricks];
  bricksWithoutCurrent[brickIndex] = {start: [-1, -1, -1], end: [-1, -1, -1]};
  return bricksAbove.every(b => !canBrickFall(bricksWithoutCurrent, b));
};

const getAnswer = strings => {
  let bricks = strings
    .map(n => parseBrick(n))
    .sort((a, b) => Math.min(a.end[2], a.start[2]) - Math.min(b.end[2], b.start[2]));

  bricks = fallBricks(bricks);
  printSpace(bricks);

  const numberOfRemovableBlocks = bricks.reduce((acc, curr, i) => {
    if (canBrickBeRemoved(bricks, i)) {
      acc++;
      console.log('REMOVABLE:', i);
    }
    return acc;
  }, 0);

  console.log('RES:', numberOfRemovableBlocks);

  return numberOfRemovableBlocks;
};

writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
