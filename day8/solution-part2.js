const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const {getMap, nextInstructionIndex} = require('./solution-part1');
const input = readFileToString('input.txt');

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

const getAnswer = strings => {
  const instructions = strings[0];
  const map = getMap(strings);

  const cyclesLength = Object.keys(map)
    .filter(k => k.endsWith('A'))
    .map(currNode => {
      let counter = 0;
      let currInstructionIndex = 0;

      while (!currNode.endsWith('Z')) {
        currNode = map[currNode][instructions[currInstructionIndex]];
        currInstructionIndex = nextInstructionIndex(currInstructionIndex, instructions);
        counter++;
      }

      return counter;
    });

  return lcm(...cyclesLength);
};

writeStringToFile(getAnswer(input).toString(), 'answer2.txt');
