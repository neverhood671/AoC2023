const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');
const expansion = 1000000;

const getShortestPath = (g1, g2) => {
  const [x1, y1] = g1,
    [x2, y2] = g2;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const getExpandedMap = map => {
  const columnsWithoutGalaxies = [];
  const rowWithoutGalaxies = [];
  for (let j = 0; j < map[0].length; j++) {
    let hasColumnGalaxy = false;
    for (let i = 0; i < map.length; i++) {
      if (map[i][j] === '#') {
        hasColumnGalaxy = true;
        break;
      }
    }
    if (!hasColumnGalaxy) columnsWithoutGalaxies.push(j);
  }
  for (let i = 0; i < map.length; i++) {
    if (!map[i].some(s => s === '#')) {
      rowWithoutGalaxies.push(i);
    }
  }

  return [rowWithoutGalaxies, columnsWithoutGalaxies];
};

const getGalaxiesCoordinates = map => {
  const galaxies = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === '#') {
        galaxies.push([i, j]);
      }
    }
  }

  return galaxies;
};

const numberOfExpansionBetweenIndexes = (c1, c2, emptyArr) => {
  return emptyArr.reduce((acc, curr) => {
    const biggerC = Math.max(c1, c2),
      smallerC = Math.min(c1, c2);
    if (curr < biggerC && curr > smallerC) acc++;
    return acc;
  }, 0);
};

const getAnswer = strings => {
  const map = strings.map(s => s.split(''));
  const [rowWithoutGalaxies, columnsWithoutGalaxies] = getExpandedMap(map);

  const galaxies = getGalaxiesCoordinates(map);

  let acc = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const xExpansion =
          numberOfExpansionBetweenIndexes(galaxies[i][0], galaxies[j][0], rowWithoutGalaxies) *
          (expansion - 1),
        yExpansion =
          numberOfExpansionBetweenIndexes(galaxies[i][1], galaxies[j][1], columnsWithoutGalaxies) *
          (expansion - 1);
      acc += getShortestPath(galaxies[i], galaxies[j]) + xExpansion + yExpansion;
    }
  }

  return acc;
};
writeStringToFile(getAnswer(input).toString(), 'answer2.txt');
