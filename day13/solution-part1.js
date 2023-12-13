const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');

const isMirrorHere = (pattern, mirrorPosition, orientation) => {
  if (orientation === 'horizontal') {
    let x = 1;
    while (x <= mirrorPosition) {
      const s1 = pattern[mirrorPosition - x],
        s2 = pattern[mirrorPosition + x - 1];
      if (!s1 || !s2) break;
      if (s1 !== s2) return false;
      x++;
    }
    return true;
  }

  if (orientation === 'vertical') {
    let y = 1;
    while (y <= mirrorPosition) {
      const s1 = pattern.map(s => s[mirrorPosition - y]).join(''),
        s2 = pattern.map(s => s[mirrorPosition + y - 1]).join('');
      if (!s1 || !s2) break;
      if (s1 !== s2) return false;
      y++;
    }
    return true;
  }
};

const findMirror = pattern => {
  for (let i = 1; i < pattern.length; i++) {
    let isMirror = isMirrorHere(pattern, i, 'horizontal');
    if (isMirror) return [i, 0];
  }

  for (let j = 1; j < pattern[0].length; j++) {
    let isMirror = isMirrorHere(pattern, j, 'vertical');
    if (isMirror) return [0, j];
  }
};

const getAnswer = strings => {
  const patterns = strings.reduce(
    (acc, curr) => {
      if (curr.length === 0) acc.push([]);
      else acc[acc.length - 1].push(curr);
      return acc;
    },
    [[]]
  );
  return patterns
    .map(p => findMirror(p))
    .reduce((acc, curr) => {
      acc += curr[0] === 0 ? curr[1] : curr[0] * 100;
      return acc;
    }, 0);
};
writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
