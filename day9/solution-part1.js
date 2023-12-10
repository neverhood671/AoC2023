const processLineByLine = require('../utils/processLineByLine');

const getAnswer = (line, acc) => {
  let isAllZeroes = false,
    lines = [line.split(' ').map(c => parseInt(c))];

  while (!isAllZeroes) {
    const newLine = [];
    const currLine = lines[lines.length - 1];
    for (let i = 0; i < currLine.length - 1; i++) {
      newLine.push(currLine[i + 1] - currLine[i]);
    }
    lines.push([...newLine]);
    isAllZeroes = newLine.every(x => x === 0);
  }

  lines[lines.length - 1].push(0);

  for (let i = lines.length - 1; i > 0; i--) {
    const currLineLastChar = lines[i][lines[i].length - 1],
      nextLineLastChar = lines[i - 1][lines[i - 1].length - 1];
    lines[i - 1].push(currLineLastChar + nextLineLastChar);
  }

  return acc + lines[0][lines[0].length - 1];
};

processLineByLine(getAnswer, 0, 'answer1.txt');
