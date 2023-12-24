const range = (min, max) => {
  const len = max - min + 1;
  const arr = new Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = min + i;
  }
  return arr;
};

module.exports = range;
