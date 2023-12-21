const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const input = readFileToString('input.txt');

const getAnswer = strings => {
  const actions = strings.map(s => s.split(' '));

  let minX = Number.MAX_SAFE_INTEGER,
    minY = Number.MAX_SAFE_INTEGER,
    maxX = Number.MIN_SAFE_INTEGER,
    maxY = Number.MIN_SAFE_INTEGER;
  let currX = 0,
    currY = 0;
  actions.forEach(([direction, stepsNumStr]) => {
    const stepsNum = parseInt(stepsNumStr);
    switch (direction) {
      case 'R':
        currY += stepsNum;
        break;
      case 'L':
        currY -= stepsNum;
        break;
      case 'U':
        currX -= stepsNum;
        break;
      case 'D':
        currX += stepsNum;
        break;
    }
    if (currX < minX) minX = currX;
    if (currY < minY) minY = currY;
    if (currX > maxX) maxX = currX;
    if (currY > maxY) maxY = currY;
  });

  const startX = Math.abs(minX),
    startY = Math.abs(minY);

  const field = [];
  for (let i = 0; i <= maxX - minX; i++) {
    for (let j = 0; j <= maxY - minY; j++) {
      if (!field[i]) field[i] = [];
      field[i][j] = '.';
    }
  }

  let currTileX = startX,
    currTileY = startY;

  actions.forEach(([direction, stepsNumStr]) => {
    const stepsNum = parseInt(stepsNumStr);
    switch (direction) {
      case 'R':
        for (let j = currTileY; j <= currTileY + stepsNum; j++) {
          field[currTileX][j] = ['D', 'U'].includes(field[currTileX][j])
            ? field[currTileX][j]
            : '#';
        }
        currTileY += stepsNum;
        break;
      case 'L':
        for (let j = currTileY; j >= currTileY - stepsNum; j--) {
          field[currTileX][j] = ['D', 'U'].includes(field[currTileX][j])
            ? field[currTileX][j]
            : '#';
        }
        currTileY -= stepsNum;
        break;
      case 'U':
        for (let i = currTileX; i >= currTileX - stepsNum; i--) {
          field[i][currTileY] = 'U';
        }
        currTileX -= stepsNum;
        break;
      case 'D':
        for (let i = currTileX; i <= currTileX + stepsNum; i++) {
          field[i][currTileY] = 'D';
        }
        currTileX += stepsNum;
        break;
    }
  });

  field.map(s => console.log(s.join(''))).join('\n');

  let res = 0;

  for (let i = 0; i < field.length; i++) {
    let isCounting = false;
    let tilesInRow = 0;
    for (let j = 0; j < field[0].length; j++) {
      if (['D', 'U', '#'].includes(field[i][j])) tilesInRow++;
      if (isCounting && field[i][j] === '.') {
        tilesInRow++;
      } else if (!isCounting && field[i][j] === 'U') {
        isCounting = true;
      } else if (isCounting && field[i][j] === 'D') {
        isCounting = false;
      }
    }
    console.log(i, tilesInRow);
    res += tilesInRow;
  }

  console.log(res);
  return field.map(s => s.join('')).join('\n');
};
writeStringToFile(getAnswer(input), 'answer1.txt');
