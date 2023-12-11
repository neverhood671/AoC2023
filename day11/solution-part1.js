const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');

const getShortestPath = (g1, g2) => {
  const [x1, y1] = g1,
    [x2, y2] = g2;

  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const getExpandedMap = map => {
  const expandedMap = [];
  const columnsWithoutGalaxies = [];
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
    const expandedRow = map[i].reduce((acc, curr, j) => {
      acc.push(curr);
      if (columnsWithoutGalaxies.includes(j)) {
        acc.push(curr);
      }
      return acc;
    }, []);
    expandedMap.push(expandedRow);
    if (!map[i].some(s => s === '#')) {
      expandedMap.push(expandedRow);
    }
  }

  return expandedMap;
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

const getAnswer = strings => {
  const map = strings.map(s => s.split(''));
  const expandedMap = getExpandedMap(map);
  const galaxies = getGalaxiesCoordinates(expandedMap);
  let acc = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      acc += getShortestPath(galaxies[i], galaxies[j]);
    }
  }
  return acc;
};
writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
