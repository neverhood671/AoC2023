const readFileToString = require('../utils/readAllStringsFromFile');
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
    if (num >= currMaps[i][0] && num < currMaps[i][0] + currMaps[i][2]) {
      res = currMaps[i][1] + (num - currMaps[i][0]);
      break;
    }
  }
  if (res === -1) res = num;
  return res;
};

const isSeedExists = (seed, seedIntervals) => {
  for (let i = 0; i < seedIntervals.length / 2; i++) {
    if (seed >= seedIntervals[2 * i] && seed < seedIntervals[2 * i] + seedIntervals[2 * i + 1]) {
      return true;
    }
  }
  return false;
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
  const seedIntervals = getArrOfNumbersFromStr(strings[0]);

  const categoriesMaps = categories
    .reverse()
    .map(cat => getLinesForMap(strings, cat).map(str => getArrOfNumbersFromStr(str)));

  let location = 0;
  while (true) {
    const seed = categoriesMaps.reduce((acc, curr) => {
      acc = getNextNum(acc, curr);
      return acc;
    }, location);

    if (isSeedExists(seed, seedIntervals)) return location;
    location++;
  }
};
const input = readFileToString('input.txt');

writeStringToFile(getAnswer(input).toString(), 'answer2.txt');
