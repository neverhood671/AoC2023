const processLineByLine = require('../utils/processLineByLine');
const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

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

    const x = getStrNum(line, i);
    isNumberFound = !isNaN(x);
    if (isNumberFound) {
      res += x;
      break;
    }

    i = fromStart ? i + 1 : i - 1;
  }
  return res;
}

function getStrNum(line, start) {
  for (let i = 0; i < digits.length; i++) {
    if (line.startsWith(digits[i], start)) {
      return i + 1;
    }
  }
  return NaN;
}

processLineByLine(
  (line, acc) => acc + parseInt('' + getNumber(line) + getNumber(line, false)),
  0,
  'answer2.txt'
);
