const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const input = readFileToString('input.txt');
const getArrOfNumbersFromStr = require('../utils/getArrOfNumbersFromStr');

const calcNumberOfVariants = (times, distances) => {
  const attempts = times.map((time, i) => {
    const currRecord = distances[i];
    let res = 0;
    for (let t = 0; t < time; t++) {
      if ((time - t) * t > currRecord) res++;
    }
    return res;
  });
  return attempts.reduce((acc, curr) => acc * curr, 1);
};
const getAnswer = strings => {
  const times = getArrOfNumbersFromStr(strings[0]),
    distances = getArrOfNumbersFromStr(strings[1]);

  return calcNumberOfVariants(times, distances);
};
writeStringToFile(getAnswer(input).toString(), 'answer1.txt');

module.exports.calcNumberOfVariants = calcNumberOfVariants;
