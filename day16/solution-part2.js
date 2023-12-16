const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');

const haveWeBeenHereBefore = (visitedStates, currBeamState) => {
  return visitedStates.some(
    state =>
      state.position[0] === currBeamState.position[0] &&
      state.position[1] === currBeamState.position[1] &&
      state.direction === currBeamState.direction
  );
};

const getVisitedStatesNumber = (visitedStates, map) => {
  const output = [];
  let res = 0;
  map.forEach((row, i) => {
    output.push([]);
    row.forEach((col, j) => {
      output[i][j] = visitedStates.some(state => state.position[0] === i && state.position[1] === j)
        ? '#'
        : '.';

      if (output[i][j] === '#') res++;
    });
  });
  // output.map(s => console.log(s.join('')));

  return res;
};

const runBeamFromPoint = (map, startBeamState) => {
  const visitedStates = [];
  const stack = [startBeamState];

  while (stack.length > 0) {
    const currBeamState = stack.pop();
    if (haveWeBeenHereBefore(visitedStates, currBeamState)) continue;
    visitedStates.push(currBeamState);

    if (currBeamState.direction === 'right' && currBeamState.position[1] <= map[0].length - 1) {
      const currTile = map[currBeamState.position[0]][currBeamState.position[1]];
      if (currTile === '.' || currTile === '-') {
        stack.push({
          position: [currBeamState.position[0], currBeamState.position[1] + 1],
          direction: 'right',
        });
      } else if (currTile === '/' && currBeamState.position[0] > 0) {
        stack.push({
          position: [currBeamState.position[0] - 1, currBeamState.position[1]],
          direction: 'up',
        });
      } else if (currTile === '\\' && currBeamState.position[0] < map.length - 1) {
        stack.push({
          position: [currBeamState.position[0] + 1, currBeamState.position[1]],
          direction: 'down',
        });
      } else if (currTile === '|') {
        if (currBeamState.position[0] > 0) {
          stack.push({
            position: [currBeamState.position[0] - 1, currBeamState.position[1]],
            direction: 'up',
          });
        }
        if (currBeamState.position[0] < map.length - 1) {
          stack.push({
            position: [currBeamState.position[0] + 1, currBeamState.position[1]],
            direction: 'down',
          });
        }
      }
    } else if (currBeamState.direction === 'left' && currBeamState.position[1] >= 0) {
      const currTile = map[currBeamState.position[0]][currBeamState.position[1]];
      if (currTile === '.' || currTile === '-') {
        stack.push({
          position: [currBeamState.position[0], currBeamState.position[1] - 1],
          direction: 'left',
        });
      } else if (currTile === '/' && currBeamState.position[0] < map.length - 1) {
        stack.push({
          position: [currBeamState.position[0] + 1, currBeamState.position[1]],
          direction: 'down',
        });
      } else if (currTile === '\\' && currBeamState.position[0] > 0) {
        stack.push({
          position: [currBeamState.position[0] - 1, currBeamState.position[1]],
          direction: 'up',
        });
      } else if (currTile === '|') {
        if (currBeamState.position[0] > 0) {
          stack.push({
            position: [currBeamState.position[0] - 1, currBeamState.position[1]],
            direction: 'up',
          });
        }
        if (currBeamState.position[0] < map.length - 1) {
          stack.push({
            position: [currBeamState.position[0] + 1, currBeamState.position[1]],
            direction: 'down',
          });
        }
      }
    } else if (currBeamState.direction === 'up' && currBeamState.position[0] >= 0) {
      const currTile = map[currBeamState.position[0]][currBeamState.position[1]];
      if (currTile === '.' || currTile === '|') {
        stack.push({
          position: [currBeamState.position[0] - 1, currBeamState.position[1]],
          direction: 'up',
        });
      } else if (currTile === '/' && currBeamState.position[1] < map[0].length - 1) {
        stack.push({
          position: [currBeamState.position[0], currBeamState.position[1] + 1],
          direction: 'right',
        });
      } else if (currTile === '\\' && currBeamState.position[1] > 0) {
        stack.push({
          position: [currBeamState.position[0], currBeamState.position[1] - 1],
          direction: 'left',
        });
      } else if (currTile === '-') {
        if (currBeamState.position[1] > 0) {
          stack.push({
            position: [currBeamState.position[0], currBeamState.position[1] - 1],
            direction: 'left',
          });
        }
        if (currBeamState.position[1] < map[0].length - 1) {
          stack.push({
            position: [currBeamState.position[0], currBeamState.position[1] + 1],
            direction: 'right',
          });
        }
      }
    } else if (currBeamState.direction === 'down' && currBeamState.position[0] <= map.length - 1) {
      const currTile = map[currBeamState.position[0]][currBeamState.position[1]];
      if (currTile === '.' || currTile === '|') {
        stack.push({
          position: [currBeamState.position[0] + 1, currBeamState.position[1]],
          direction: 'down',
        });
      } else if (currTile === '/' && currBeamState.position[1] > 0) {
        stack.push({
          position: [currBeamState.position[0], currBeamState.position[1] - 1],
          direction: 'left',
        });
      } else if (currTile === '\\' && currBeamState.position[1] < map[0].length - 1) {
        stack.push({
          position: [currBeamState.position[0], currBeamState.position[1] + 1],
          direction: 'right',
        });
      } else if (currTile === '-') {
        if (currBeamState.position[1] > 0) {
          stack.push({
            position: [currBeamState.position[0], currBeamState.position[1] - 1],
            direction: 'left',
          });
        }
        if (currBeamState.position[1] < map[0].length - 1) {
          stack.push({
            position: [currBeamState.position[0], currBeamState.position[1] + 1],
            direction: 'right',
          });
        }
      }
    }
  }
  return getVisitedStatesNumber(visitedStates, map);
};

const getPossibleBeamDirection = (map, position) => {
  const res = [];
  if (position[0] === 0) res.push('down');
  if (position[0] === map.length - 1) res.push('up');
  if (position[1] === 0) res.push('right');
  if (position[1] === map[0].length - 1) res.push('left');
  return res;
};

const getAnswer = strings => {
  const map = strings.map(s => s.split(''));
  let max = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < map.length; i++) {
    [0, map[0].length - 1].forEach(j => {
      const directions = getPossibleBeamDirection(map, [i, j]);
      directions.forEach(d => {
        const startBeamState = {
          position: [i, j],
          direction: d,
        };
        const res = runBeamFromPoint(map, startBeamState);
        if (res > max) max = res;
      });
    });
  }

  for (let j = 1; j < map.length - 1; j++) {
    [0, map.length - 1].forEach(i => {
      const directions = getPossibleBeamDirection(map, [i, j]);
      directions.forEach(d => {
        const startBeamState = {
          position: [i, j],
          direction: d,
        };
        const res = runBeamFromPoint(map, startBeamState);
        if (res > max) max = res;
      });
    });
  }

  return max;
};
writeStringToFile(getAnswer(input).toString(), 'answer2.txt');
