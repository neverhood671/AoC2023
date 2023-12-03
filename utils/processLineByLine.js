const fs = require('fs');
const readline = require('readline');
const writeStringToFile = require('./writeStringToFile');

async function processLineByLine(lineProcessor, accInitValue, resFileName) {
  const fileStream = fs.createReadStream('input.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let acc = accInitValue;
  for await (const line of rl) {
    acc = lineProcessor(line, acc);
  }
  writeStringToFile(acc.toString(), resFileName);
}

module.exports = processLineByLine;
