const getArrOfNumbersFromStr = str => {
  const regexpNumbers = /[\d]+/g;
  return [...str.matchAll(regexpNumbers)].map(item => parseInt(item[0]));
};

module.exports = getArrOfNumbersFromStr;
