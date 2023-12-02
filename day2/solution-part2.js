const processLineByLine = require('../utils/processLineByLine');
const getNumberFromStr = require('../utils/getNumberFromStr');

const colors = ['red', 'green', 'blue'];
const getAnswer = (line, acc) => {
  const [, gameInput] = line.split(': ');
  const rounds = gameInput.split('; ');
  const minCubesNumber = colors.reduce((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {});
  rounds.forEach(dataStr => {
    dataStr.split(',').forEach(cubesStr => {
      for (const color of colors) {
        if (cubesStr.includes(color)) {
          minCubesNumber[color] = Math.max(minCubesNumber[color], getNumberFromStr(cubesStr));
        }
      }
    });
  });
  acc += Object.keys(minCubesNumber).reduce((acc, curr) => acc * minCubesNumber[curr], 1);
  return acc;
};
processLineByLine(getAnswer, 0, 'answer2.txt');
