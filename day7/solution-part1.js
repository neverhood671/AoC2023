const readFileToString = require('../utils/readAllStringsFromFile');
const writeStringToFile = require('../utils/writeStringToFile');
const input = readFileToString('input.txt');

const getTypeOfHand = hand => {
  const handDescription = hand.reduce((acc, curr) => {
    if (Object.keys(acc).includes(curr)) acc[curr]++;
    else acc[curr] = 1;
    return acc;
  }, {});

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

const handsComparator = (hand1, hand2) => {
  const type1 = getTypeOfHand(hand1),
    type2 = getTypeOfHand(hand2);

  if (type1 !== type2) return type2 - type1;

  const cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  for (let i = 0; i < 5; i++) {
    if (hand1[i] !== hand2[i])
      return cards.findIndex(x => x === hand2[i]) - cards.findIndex(x => x === hand1[i]);
  }
};

const getAnswer = strings =>
  strings
    .filter(s => s.length > 0)
    .map(s => {
      const [handStr, bidStr] = s.split(' ');
      return {
        bid: parseInt(bidStr),
        hand: handStr.split(''),
      };
    })
    .sort((item1, item2) => handsComparator(item1.hand, item2.hand))
    .reduce((acc, curr, i) => acc + curr.bid * (i + 1), 0);

writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
