const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const range = require('../utils/range');

const getLineCharIndexes = line => {
  const regexp = /[^.\d]/g;
  return [...line.matchAll(regexp)].map(item => item.index);
};

const getLineGearIndexes = line => {
  const res = [];
  line.split('').forEach((char, i) => {
    if (char === '*') res.push(i);
  });
  return res;
};

const getPartNumbers = (line, prevLineCharIndexes, currLineCharIndexes, nextLineCharIndexes) => {
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
      partNumbers.push({
        number: item.number,
        indexRange: range(item.index, item.index + item.number.length - 1),
      });
  });
  return partNumbers;
};

const getAnswer = strings => {
  let prevLineCharIndexes = [],
    currLineCharIndexes = getLineCharIndexes(strings[0]),
    nextLineCharIndexes = getLineCharIndexes(strings[1]);
  let acc = 0;
  const partNumbersLines = [];
  const gearLines = [];

  for (let i = 0; i < strings.length; i++) {
    prevLineCharIndexes = currLineCharIndexes;
    currLineCharIndexes = nextLineCharIndexes;
    nextLineCharIndexes = getLineCharIndexes(strings[i + 1] || '');
    const partNumbers = getPartNumbers(
      strings[i],
      prevLineCharIndexes,
      currLineCharIndexes,
      nextLineCharIndexes
    );
    partNumbersLines.push(partNumbers);
    gearLines.push(getLineGearIndexes(strings[i]));
  }

  for (let i = 0; i < gearLines.length; i++) {
    for (let j = 0; j < gearLines[i].length; j++) {
      const partNumbersAround = [];
      const gearIndex = gearLines[i][j];

      const indexRange = range(
        Math.max(gearIndex - 1, 0),
        Math.min(gearIndex + 1, strings[0].length - 1)
      );

      const prevLinePartNumbers = partNumbersLines[i - 1] || [],
        currLinePartNumbers = partNumbersLines[i],
        nextLinePartNumbers = partNumbersLines[i + 1] || [];

      partNumbersAround.push(
        ...currLinePartNumbers
          .filter(item => item.indexRange.some(r => indexRange.includes(r)))
          .map(item => parseInt(item.number))
      );

      partNumbersAround.push(
        ...prevLinePartNumbers
          .filter(item => item.indexRange.some(r => indexRange.includes(r)))
          .map(item => parseInt(item.number))
      );

      partNumbersAround.push(
        ...nextLinePartNumbers
          .filter(item => item.indexRange.some(r => indexRange.includes(r)))
          .map(item => parseInt(item.number))
      );

      acc =
        partNumbersAround.length === 2 ? acc + partNumbersAround[0] * partNumbersAround[1] : acc;
    }
  }

  return acc;
};

const input = readFileToString('input.txt');

writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
