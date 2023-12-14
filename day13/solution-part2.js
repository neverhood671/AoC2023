const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');

const doStringsDifferByOneChar = (s1, s2) => {
  let numOfDiffChars = 0;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) numOfDiffChars++;
    if (numOfDiffChars > 1) return false;
  }
  return numOfDiffChars === 1;
};

const isMirrorHere = (pattern, mirrorPosition, orientation) => {
  if (orientation === 'horizontal') {
    let x = 1;
    let numOfDiffStrings = 0;
    let diffS1, diffs2;
    while (x <= mirrorPosition) {
      const s1 = pattern[mirrorPosition - x],
        s2 = pattern[mirrorPosition + x - 1];
      if (s1 && s2 && s1 !== s2) {
        numOfDiffStrings++;
        diffS1 = s1;
        diffs2 = s2;
      }
      if (numOfDiffStrings > 1) return false;
      x++;
    }
    if (numOfDiffStrings === 0) return false;
    return doStringsDifferByOneChar(diffS1, diffs2);
  }

  if (orientation === 'vertical') {
    let y = 1;
    let numOfDiffStrings = 0;
    let diffS1, diffs2;
    while (y <= mirrorPosition) {
      const s1 = pattern.map(s => s[mirrorPosition - y]).join(''),
        s2 = pattern.map(s => s[mirrorPosition + y - 1]).join('');

      if (s1 && s2 && s1 !== s2) {
        numOfDiffStrings++;
        diffS1 = s1;
        diffs2 = s2;
      }
      if (numOfDiffStrings > 1) return false;
      y++;
    }
    if (numOfDiffStrings === 0) return false;
    return doStringsDifferByOneChar(diffS1, diffs2);
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
  const res = patterns
    .map(p => findMirror(p))
    .reduce((acc, curr) => {
      acc += curr[0] === 0 ? curr[1] : curr[0] * 100;
      return acc;
    }, 0);

  // console.log(
  //   123,
  //   res.forEach(r => console.log(r))
  // );
  console.log(res);
  return res;
};
writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
