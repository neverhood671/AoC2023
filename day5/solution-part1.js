const readFileToString = require('../utils/readFileToString');
const writeStringToFile = require('../utils/writeStringToFile');
const getArrOfNumbersFromStr = require('../utils/getArrOfNumbersFromStr');

const getLinesForMap = (strings, mapName) => {
  const headerIndex = strings.findIndex(s => s.includes(mapName));
  const endIndexMargin = strings.slice(headerIndex + 1).findIndex(s => s.length === 0);
  return strings.slice(
    headerIndex + 1,
    headerIndex + (endIndexMargin === -1 ? strings.length - 1 : endIndexMargin) + 1
  );
};

const getNextNum = (num, currMaps) => {
  let res = -1;
  for (let i = 0; i < currMaps.length; i++) {
    if (num >= currMaps[i][1] && num < currMaps[i][1] + currMaps[i][2]) {
      res = currMaps[i][0] + (num - currMaps[i][1]);
      break;
    }
  }
  if (res === -1) res = num;
  return res;
};

const getAnswer = strings => {
  const categories = [
    'seed-to-soil',
    'soil-to-fertilizer',
    'fertilizer-to-water',
    'water-to-light',
    'light-to-temperature',
    'temperature-to-humidity',
    'humidity-to-location',
  ];
  const seeds = getArrOfNumbersFromStr(strings[0]);
  const categoriesMaps = categories.map(cat =>
    getLinesForMap(strings, cat).map(str => getArrOfNumbersFromStr(str))
  );

  const locations = seeds.map(seed =>
    categoriesMaps.reduce((acc, curr) => {
      acc = getNextNum(acc, curr);
      return acc;
    }, seed)
  );

  return Math.min(...locations);
};
const input = readFileToString('input.txt');

writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
