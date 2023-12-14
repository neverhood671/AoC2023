const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');

const swap = (arr, from, to) => {
  arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
};
const getTotalLoad = strings =>
  strings.reduce(
    (acc, curr, i, arr) => acc + curr.filter(char => char === 'O').length * (arr.length - i),
    0
  );

const rollRocksInCurrArrToNorth = currArr => {
  for (let i = 0; i < currArr.length; i++) {
    if (currArr[i] === 'O') {
      let movingSteps = 0;
      for (let d = i - 1; d >= 0; d--) {
        if (currArr[d] === '.') movingSteps++;
        else break;
      }

      if (movingSteps > 0) {
        swap(currArr, i, i - movingSteps);
      }
    }
  }
};

const rollRocksInCurrArrToSouth = currArr => {
  for (let i = currArr.length - 1; i >= 0; i--) {
    if (currArr[i] === 'O') {
      let movingSteps = 0;
      for (let d = i + 1; d < currArr.length; d++) {
        if (currArr[d] === '.') movingSteps++;
        else break;
      }

      if (movingSteps > 0) {
        swap(currArr, i, i + movingSteps);
      }
    }
  }
};

const rollRocksInCurrArrToWest = currArr => {
  rollRocksInCurrArrToNorth(currArr);
};

const rollRocksInCurrArrToEast = currArr => {
  rollRocksInCurrArrToSouth(currArr);
};

const transposeMatrix = matrix =>
  matrix.reduce((acc, curr) => {
    for (let j = 0; j < curr.length; j++) {
      if (!acc[j]) acc[j] = [];
      acc[j].push(curr[j]);
    }
    return acc;
  }, []);
const tiltPlatformToNorth = strings => {
  const columns = transposeMatrix(strings);
  columns.forEach(c => rollRocksInCurrArrToNorth(c));
  return transposeMatrix(columns);
};

const tiltPlatformToSouth = strings => {
  const columns = transposeMatrix(strings);
  columns.forEach(c => rollRocksInCurrArrToSouth(c));
  return transposeMatrix(columns);
};

const tiltPlatformToWest = strings => {
  strings.forEach(c => rollRocksInCurrArrToWest(c));
  return strings;
};

const tiltPlatformToEast = strings => {
  strings.forEach(c => rollRocksInCurrArrToEast(c));
  return strings;
};
const getAnswer = strings => {
  strings = strings.map(s => s.split(''));
  let cycles = 1000000000;
  const matrixMap = {};
  let mStart, mEnd;
  while (cycles > 0) {
    mStart = mEnd || strings.map(s => s.join('')).join('\n');
    if (!matrixMap[mStart]) {
      strings = tiltPlatformToNorth(strings);
      strings = tiltPlatformToWest(strings);
      strings = tiltPlatformToSouth(strings);
      strings = tiltPlatformToEast(strings);
      mEnd = strings.map(s => s.join('')).join('\n');
      matrixMap[mStart] = mEnd;
    } else {
      mEnd = matrixMap[mStart];
    }
    cycles--;
  }
  const finalMatrix = mEnd.split('\n').map(s => s.split(''));
  return getTotalLoad(finalMatrix);
};
writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
