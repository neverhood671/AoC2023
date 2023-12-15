const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');

const getStepHash = (s, hashStart) => s.split('').reduce((acc, curr) => {
    acc += curr.charCodeAt(0)
    acc *= 17
    acc %= 256
    return acc
}, hashStart);

const getLensFocusingPower = (box, slot, focalLength) => (1 + box) * slot * focalLength
const getAnswer = string => {
    const boxes = {}
    const steps = string.split(',')
    steps.forEach(s => {
        const operationChar = s.includes('-') ? '-' : '='
        const label = s.split(operationChar)[0]
        const boxIndex = getStepHash(label, 0)
        if (!boxes[boxIndex]) boxes[boxIndex] = []

        if (operationChar === '-') {
            const lensIndex = boxes[boxIndex].findIndex(l => l.label === label)
            if (lensIndex > -1) boxes[boxIndex].splice(lensIndex, 1)
        } else {
            const focalLength = parseInt(s.split(operationChar)[1])
            const lensIndex = boxes[boxIndex].findIndex(l => l.label === label)
            if (lensIndex > -1) boxes[boxIndex].splice(lensIndex, 1, {label, focalLength})
            else boxes[boxIndex].push({label, focalLength})
        }
    })

    return Object.keys(boxes).reduce((acc, curr) => {
        boxes[curr].forEach((l, i) => {
            const res = getLensFocusingPower(parseInt(curr), i + 1, l.focalLength)
            acc += res
        })
        return acc
    }, 0)
}


writeStringToFile(getAnswer(input[0]).toString(), 'answer2.txt');
