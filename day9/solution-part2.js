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
    const currLineFirstChar = lines[i][0],
      nextLineFirstChar = lines[i - 1][0];
    lines[i - 1].unshift(nextLineFirstChar - currLineFirstChar);
  }

  return acc + lines[0][0];
};

processLineByLine(getAnswer, 0, 'answer2.txt');
