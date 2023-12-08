const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const input = readFileToString('input.txt');

const getAnswer = strings => {
  const cards = strings.map((line, i) => {
    const [winNumbersStr, myNumbersStr] = line.split(':')[1].split('|');
    const regexpNumbers = /[\d]+/g;
    const winNumbers = [...winNumbersStr.matchAll(regexpNumbers)].map(item => parseInt(item[0])),
      myNumbers = [...myNumbersStr.matchAll(regexpNumbers)].map(item => parseInt(item[0]));

    return {
      id: i,
      score: winNumbers.reduce((acc, curr) => {
        if (myNumbers.includes(curr)) acc++;
        return acc;
      }, 0),
      count: 1,
    };
  });

  for (let i = 0; i < cards[cards.length - 1].id; i++) {
    for (let j = 1; j <= cards[i].score; j++) {
      cards[j + i].count += cards[i].count;
    }
  }

  return cards.reduce((acc, curr) => acc + curr.count, 0);
};
writeStringToFile(getAnswer(input).toString(), 'answer2.txt');
