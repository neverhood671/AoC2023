const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const input = readFileToString('input.txt');

const nextInstructionIndex = (currInstructionIndex, instructions) => {
  return currInstructionIndex + 1 <= instructions.length - 1 ? currInstructionIndex + 1 : 0;
};

const getMap = strings =>
  strings.slice(2).reduce((acc, s) => {
    const [key, val] = s.split(' = ');
    const [left, right] = [...val.matchAll(/[A-Z]{3}/g)].map(arr => arr[0]);
    acc[key] = {L: left, R: right};
    return acc;
  }, {});

const getAnswer = strings => {
  const instructions = strings[0];
  const map = getMap(strings);

  let counter = 0;
  let currNode = 'AAA',
    currInstructionIndex = 0;

  while (currNode !== 'ZZZ') {
    currNode = map[currNode][instructions[currInstructionIndex]];
    currInstructionIndex = nextInstructionIndex(currInstructionIndex, instructions);
    counter++;
  }

  return counter;
};

writeStringToFile(getAnswer(input).toString(), 'answer1.txt');

module.exports = {
  nextInstructionIndex,
  getMap,
};
