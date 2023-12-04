const processLineByLine = require('../utils/processLineByLine');

const getAnswer = (line, acc) => {
  const [winNumbersStr, myNumbersStr] = line.split(':')[1].split('|');
  const regexpNumbers = /[\d]+/g;
  const winNumbers = [...winNumbersStr.matchAll(regexpNumbers)].map(item => parseInt(item[0])),
    myNumbers = [...myNumbersStr.matchAll(regexpNumbers)].map(item => parseInt(item[0]));

  const intersection = winNumbers.reduce((acc, curr) => {
    if (myNumbers.includes(curr)) acc++;
    return acc;
  }, -1);

  if (intersection > -1) return acc + Math.pow(2, intersection);
  return acc;
};

processLineByLine(getAnswer, 0, 'answer1.txt');
