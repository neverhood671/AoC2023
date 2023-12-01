const processLineByLine = require('../utils/processLineByLine');

function getNumber(line, fromStart = true) {
  const chars = line.split('');
  let isNumberFound = false,
    i = fromStart ? 0 : line.length - 1;
  let res = '';
  while (!isNumberFound) {
    isNumberFound = !isNaN(parseInt(chars[i]));
    if (isNumberFound) {
      res += chars[i];
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
