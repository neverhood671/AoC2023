const processLineByLine = require('../utils/processLineByLine');
const getNumberFromStr = require('../utils/getNumberFromStr');
const targetCubesNumber = {
  red: 12,
  green: 13,
  blue: 14,
};

const getAnswer = (line, acc) => {
  // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  const [gameName, gameInput] = line.split(': ');
  const gameId = getNumberFromStr(gameName);
  const rounds = gameInput.split('; ');
  let isRoundPossible = true;
  let i = 0;
  while (i < rounds.length && isRoundPossible) {
    const cubesNumber = {...targetCubesNumber};
    rounds[i].split(',').forEach(cubesStr => {
      for (const color in targetCubesNumber) {
        if (cubesStr.includes(color)) {
          cubesNumber[color] -= getNumberFromStr(cubesStr);
          if (cubesNumber[color] < 0) {
            isRoundPossible = false;
            break;
          }
        }
      }
    });
    i++;
  }
  return isRoundPossible ? acc + gameId : acc;
};

processLineByLine(getAnswer, 0, 'answer1.txt');
