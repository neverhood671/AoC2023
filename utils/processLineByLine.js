const fs = require('fs')
const readline = require('readline')

async function processLineByLine(lineProcessor, accInitValue) {
    const fileStream = fs.createReadStream('input.txt')

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    let acc = accInitValue
    for await (const line of rl) {
        acc = lineProcessor(line, acc)
    }
    return acc;
}

module.exports = processLineByLine