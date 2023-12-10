const writeStringToFile = require('../utils/writeStringToFile');
const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const getStartCoordinates = map => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === 'S') return [i, j];
    }
  }
};

const directionsDir = {
  W: (x, y) => [x, y - 1],
  S: (x, y) => [x + 1, y],
  E: (x, y) => [x, y + 1],
  N: (x, y) => [x - 1, y],
};
const pipeDir = {
  L: {N: ['|', 'F', '7'], E: ['-', '7', 'J']},
  J: {N: ['|', '7', 'F'], W: ['-', 'L', 'F']},
  '7': {S: ['|', 'J', 'L'], W: ['-', 'F', 'L']},
  F: {S: ['|', 'L', 'J'], E: ['-', '7', 'J']},
  '|': {N: ['F', '7', '|'], S: ['L', 'J', '|']},
  '-': {W: ['L', 'F', '-'], E: ['J', '7', '-']},
};

const getOppositeDirection = direction => {
  if (direction === 'N') return 'S';
  if (direction === 'S') return 'N';
  if (direction === 'W') return 'E';
  if (direction === 'E') return 'W';
};

const getNextTiles = (currX, currY, map, direction, prevStep) => {
  const res = [],
    currPipe = map[currX][currY];
  if (currPipe === 'S') {
    if (currY > 0 && ['-', 'L', 'F'].includes(map[currX][currY - 1]))
      res.push({prevStep: prevStep + 1, cameFrom: 'E', position: [currX, currY - 1]});
    if (currX > 0 && ['|', '7', 'F'].includes(map[currX - 1][currY]))
      res.push({prevStep: prevStep + 1, cameFrom: 'S', position: [currX - 1, currY]});
    if (currY < map[0].length - 2 && ['-', 'J', '7'].includes(map[currX][currY + 1]))
      res.push({prevStep: prevStep + 1, cameFrom: 'W', position: [currX, currY + 1]});
    if (currX < map.length - 2 && ['|', 'J', 'L'].includes(map[currX + 1][currY]))
      res.push({prevStep: prevStep + 1, cameFrom: 'N', position: [currX + 1, currY]});
  } else {
    const nextTileDirection = Object.keys(pipeDir[currPipe]).find(x => x !== direction);
    const [nextX, nextY] = directionsDir[nextTileDirection](currX, currY);
    if (
      nextX >= 0 &&
      nextY >= 0 &&
      nextY < map[0].length &&
      nextX < map.length &&
      (pipeDir[currPipe][nextTileDirection].includes(map[nextX][nextY]) ||
        map[nextX][nextY] === 'S')
    )
      res.push({
        cameFrom: getOppositeDirection(nextTileDirection),
        position: [nextX, nextY],
        prevStep: prevStep + 1,
        prevPipe: currPipe,
      });
  }
  return res;
};

function makeArray(w, h, val) {
  const arr = [];
  for (let i = 0; i < h; i++) {
    arr[i] = [];
    for (let j = 0; j < w; j++) {
      arr[i][j] = val;
    }
  }
  return arr;
}
const findCycle = (startX, startY, map) => {
  let stepsMatrix = makeArray(map[0].length, map.length, '');
  let [currX, currY] = [startX, startY];
  const stack = [
    {
      position: [currX, currY],
      prevStep: -1,
    },
  ];
  while (stack.length > 0) {
    const {cameFrom, position, prevStep, prevPipe} = stack.pop();
    const [currX, currY] = position;

    if (!prevPipe && currX !== startX && currY !== startY)
      stepsMatrix = makeArray(map[0].length, map.length, '');
    if (stepsMatrix[currX][currY] === '') {
      stepsMatrix[currX][currY] = prevStep + 1;
      stack.push(...getNextTiles(currX, currY, map, cameFrom, prevStep));
    } else {
      return [prevStep, stepsMatrix];
    }
  }
};
const getSTrueValue = (startX, startY, map, stepMatrix, cycleLength) => {
  if (
    stepMatrix[startX] &&
    ((stepMatrix[startX][startY - 1] === 1 && stepMatrix[startX][startY + 1] === cycleLength) ||
      (stepMatrix[startX][startY - 1] === cycleLength && stepMatrix[startX][startY + 1] === 1))
  )
    return '-';
  if (
    stepMatrix[startX - 1] &&
    ((stepMatrix[startX - 1][startY] === 1 && stepMatrix[startX + 1][startY] === cycleLength) ||
      (stepMatrix[startX - 1][startY] === cycleLength && stepMatrix[startX + 1][startY] === 1))
  )
    return '|';
  if (
    stepMatrix[startX + 1] &&
    ((stepMatrix[startX + 1][startY] === 1 && stepMatrix[startX][startY + 1] === cycleLength) ||
      (stepMatrix[startX + 1][startY] === cycleLength && stepMatrix[startX][startY + 1] === 1))
  )
    return 'F';
  if (
    stepMatrix[startX + 1] &&
    ((stepMatrix[startX + 1][startY] === 1 && stepMatrix[startX][startY - 1] === cycleLength) ||
      (stepMatrix[startX + 1][startY] === cycleLength && stepMatrix[startX][startY - 1] === 1))
  )
    return '7';
  if (
    stepMatrix[startX - 1] &&
    ((stepMatrix[startX - 1][startY] === 1 && stepMatrix[startX][startY + 1] === cycleLength) ||
      (stepMatrix[startX - 1][startY] === cycleLength && stepMatrix[startX][startY + 1] === 1))
  )
    return 'L';

  return 'J';
};

const getInnerSquare = (map, stepMatrix) => {
  let res = 0;

  const verticalPipesStart = ['|', '7', 'F'];

  for (let i = 0; i < map.length; i++) {
    let isCounting = false;
    for (let j = 0; j < map[0].length; j++) {
      if (isCounting && (map[i][j] === '.' || !Number.isInteger(stepMatrix[i][j]))) {
        res++;
      }
      if (verticalPipesStart.includes(map[i][j]) && Number.isInteger(stepMatrix[i][j])) {
        isCounting = !isCounting;
      }
    }
  }
  return res;
};

const getAnswer = strings => {
  const map = strings.map(s => s.split(''));
  const [startX, startY] = getStartCoordinates(map);
  const [cycleLength, stepMatrix] = findCycle(startX, startY, map);

  map[startX][startY] = getSTrueValue(startX, startY, map, stepMatrix, cycleLength);
  return getInnerSquare(map, stepMatrix);
};

writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
