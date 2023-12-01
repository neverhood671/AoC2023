const fs = require('fs')
const readline = require('readline')

const digits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']

function getNumIndex(line, fromStart=true) {
    const chars = line.split('')
    let isNumberFound = false, i = fromStart ? 0 : line.length - 1;
    let res = ''
    while (!isNumberFound) {
        isNumberFound = !isNaN(parseInt(chars[i]))
        if (isNumberFound) {
            res += chars[i]
            break
        }

        const x = getStrNum(line, i)
        isNumberFound = !isNaN(x)
        if (isNumberFound) {
            res += x
            break
        }


        i = fromStart ? i+1 : i-1
    }
    return res
}

function getStrNum(line, start) {
    let isNumberFound = false
    for (let i = 0; i < digits.length; i++){
        isNumberFound = line.startsWith(digits[i], start)
        if (isNumberFound) {
            return i+1
        }
    }
    return NaN
}

async function processLineByLine() {
    const fileStream = fs.createReadStream('input.txt')

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    let sum = 0
    for await (const line of rl) {
        sum += parseInt('' + getNumIndex(line) + getNumIndex(line, false))

    }
    console.log(sum)
    return sum;
}

processLineByLine()