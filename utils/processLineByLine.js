const fs = require('fs')
const readline = require('readline')

async function processLineByLine(lineProcessor, accInitValue, resFileName) {
    const fileStream = fs.createReadStream('input.txt')

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    })

    let acc = accInitValue
    for await (const line of rl) {
        acc = lineProcessor(line, acc)
    }
    fs.writeFileSync(resFileName, acc.toString());
}

module.exports = processLineByLine