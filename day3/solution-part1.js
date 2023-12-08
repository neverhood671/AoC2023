const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');

const getLineCharIndexes = line => {
  const regexp = /[^.\d]/g;
  return [...line.matchAll(regexp)].map(item => item.index);
};

const range = (min, max) => {
  const len = max - min + 1;
  const arr = new Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = min + i;
  }
  return arr;
};

const getPartNumbersSum = (line, prevLineCharIndexes, currLineCharIndexes, nextLineCharIndexes) => {
  const partNumbers = [];
  const regexpNumbers = /[\d]+/g;
  const numbers = [...line.matchAll(regexpNumbers)].map(item => ({
    number: item[0],
    index: item.index,
  }));

  numbers.forEach(item => {
    const numberIndexRange = range(
      Math.max(item.index - 1, 0),
      Math.min(item.index + item.number.length, line.length - 1)
    );
    if (
      (item.index - 1 >= 0 && currLineCharIndexes.includes(item.index - 1)) ||
      (item.index + item.number.length < line.length &&
        currLineCharIndexes.includes(item.index + item.number.length)) ||
      prevLineCharIndexes.some(r => numberIndexRange.includes(r)) ||
      nextLineCharIndexes.some(r => numberIndexRange.includes(r))
    )
      partNumbers.push(parseInt(item.number));
  });

  return partNumbers.reduce((a, b) => a + b, 0);
};

const getAnswer = strings => {
  let prevLineCharIndexes = [],
    currLineCharIndexes = getLineCharIndexes(strings[0]),
    nextLineCharIndexes = getLineCharIndexes(strings[1]);
  let acc = 0;

  for (let i = 0; i < strings.length; i++) {
    prevLineCharIndexes = currLineCharIndexes;
    currLineCharIndexes = nextLineCharIndexes;
    nextLineCharIndexes = getLineCharIndexes(strings[i + 1] || '');
    acc =
      acc +
      getPartNumbersSum(strings[i], prevLineCharIndexes, currLineCharIndexes, nextLineCharIndexes);
  }

  return acc;
};

const input = readFileToString('input.txt');

writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
