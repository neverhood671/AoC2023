const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');

const getStepHash = (s, hashStart) => s.split('').reduce((acc, curr) => {
    acc += curr.charCodeAt(0)
    acc *= 17
    acc %= 256
    return acc
}, hashStart);

const getAnswer = string => string.split(',')
    .reduce((acc, curr) => acc + getStepHash(curr, 0), 0)


writeStringToFile(getAnswer(input[0]).toString(), 'answer1.txt');
