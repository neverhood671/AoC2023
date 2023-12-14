const readFileToString = require('../utils/readAllStringsFromFile');
const input = readFileToString('input.txt');

const writeStringToFile = require('../utils/writeStringToFile');


const swap = (arr, from, to) => {
    arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
}
const getTotalLoad = strings =>
    strings.reduce((acc, curr, i, arr) =>
        acc + curr.filter(char => char === 'O').length * (arr.length - i), 0)

const rollRocksInCurrArr = currArr => {
    for (let i = 0; i < currArr.length; i++) {
        if (currArr[i] === 'O') {
            let movingSteps = 0
            for (let d = i-1; d >= 0; d--) {
                if (currArr[d] === '.') movingSteps++;
                else break;
            }

            if (movingSteps > 0) {
                swap(currArr, i, i - movingSteps)
            }
        }
    }
}

const transposeMatrix = matrix => matrix.reduce((acc, curr) => {
    for (let j = 0; j < curr.length; j++) {
        if (!acc[j]) acc[j] = [];
        acc[j].push(curr[j])
    }
    return acc
}, [])
const tiltPlatform = strings => {
    const columns = transposeMatrix(strings)
    columns.forEach(c => rollRocksInCurrArr(c))
    return transposeMatrix(columns)
}

const getAnswer = strings => getTotalLoad(tiltPlatform(strings))
writeStringToFile(getAnswer(input).toString(), 'answer1.txt');
