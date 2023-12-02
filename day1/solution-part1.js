const processLineByLine = require('../utils/processLineByLine');

function getNumber(line, fromStart = true) {
  let isNumberFound = false,
    i = fromStart ? 0 : line.length - 1;
  let res = '';
  while (!isNumberFound) {
    isNumberFound = !isNaN(parseInt(line[i]));
    if (isNumberFound) {
      res += line[i];
      break;
    }
    i = fromStart ? i + 1 : i - 1;
  }
  return res;
}

processLineByLine(
  (line, acc) => acc + parseInt('' + getNumber(line) + getNumber(line, false)),
  0,
  'answer1.txt'
);
