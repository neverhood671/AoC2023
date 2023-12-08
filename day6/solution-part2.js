const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const input = readFileToString('input.txt');
const getArrOfNumbersFromStr = require('../utils/getArrOfNumbersFromStr');
const {calcNumberOfVariants} = require('./solution-part1');

const getAnswer = strings => {
  const times = getArrOfNumbersFromStr(strings[0].replaceAll(' ', '')),
    distances = getArrOfNumbersFromStr(strings[1].replaceAll(' ', ''));

  return calcNumberOfVariants(times, distances);
};
writeStringToFile(getAnswer(input).toString(), 'answer2.txt');
