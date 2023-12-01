const fs = require('fs')
const readline = require('readline')

async function processLineByLine(lineProcessor) {
    const fileStream = fs.createReadStream('input.txt')

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    let sum = 0
    for await (const line of rl) {
        sum += lineProcessor(line)
    }
    console.log(sum)
    return sum;
}

function getNumFromLine(line) {
    const chars = line.split('')
    let isNumberFound = false, i = 0;
    let res = ''
    while (!isNumberFound) {
        isNumberFound = !isNaN(parseInt(chars[i]))
        if (isNumberFound) {
            res += chars[i]
            break
        }
        i++
    }
    isNumberFound = false
    i = line.length - 1
    while (!isNumberFound) {
        isNumberFound = !isNaN(parseInt(chars[i]))
        if (isNumberFound) {
            res += chars[i]
            break
        }
        i--
    }
    return parseInt(res)
}

processLineByLine(getNumFromLine);