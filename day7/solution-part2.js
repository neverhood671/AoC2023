const readAllStringsFromFile = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const input = readAllStringsFromFile('input.txt');

const getHandDescription = hand =>
  hand.split('').reduce((acc, curr) => {
    if (Object.keys(acc).includes(curr)) acc[curr]++;
    else acc[curr] = 1;
    return acc;
  }, {});

const getTypeByHandDescription = handDescription => {
  if (Object.keys(handDescription).length === 1) return 1; // Five of a kind
  if (Object.keys(handDescription).length === 2) {
    if (Math.max(...Object.values(handDescription)) === 4) return 2; // Four of a kind
    return 3; // Full house
  }
  if (Object.keys(handDescription).length === 3) {
    if (Math.max(...Object.values(handDescription)) === 3) return 4; // Three of a kind
    return 5; // Two pair
  }
  if (Object.keys(handDescription).length === 4) return 6; // One pair
  return 7; // High card
};

const getMaxValueOfObjectWithKeyNotEqualJ = obj => {
  let max = -1;
  Object.keys(obj)
    .filter(x => x !== 'J')
    .forEach(x => {
      if (obj[x] > max) max = obj[x];
    });

  return max;
};

const getTypeOfHand = hand => {
  if (!hand.includes('J')) getTypeByHandDescription(getHandDescription(hand));

  const handDescription = getHandDescription(hand);
  if (handDescription['J'] === 5) return getTypeByHandDescription(handDescription);

  const charToReplace = Object.keys(handDescription)
    .filter(x => x !== 'J')
    .find(x => handDescription[x] === getMaxValueOfObjectWithKeyNotEqualJ(handDescription));

  const newHand = hand.replaceAll('J', charToReplace);

  return getTypeByHandDescription(getHandDescription(newHand));
};

const handsComparator = (item1, item2) => {
  if (item1.type !== item2.type) return item2.type - item1.type;

  const cards = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

  for (let i = 0; i < 5; i++) {
    if (item1.hand[i] !== item2.hand[i])
      return cards.findIndex(x => x === item2.hand[i]) - cards.findIndex(x => x === item1.hand[i]);
  }
};

const getAnswer = strings =>
  strings
    .map(s => {
      const [hand, bidStr] = s.split(' ');
      return {
        bid: parseInt(bidStr),
        type: getTypeOfHand(hand),
        hand,
      };
    })
    .sort((item1, item2) => handsComparator(item1, item2))
    .reduce((acc, curr, i) => acc + curr.bid * (i + 1), 0);

writeStringToFile(getAnswer(input).toString(), 'answer2.txt');
