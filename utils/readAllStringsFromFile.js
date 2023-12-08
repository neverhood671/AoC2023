const fs = require('fs');

function readAllStringsFromFile(filePath) {
  return fs
    .readFileSync(filePath)
    .toString('utf-8')
    .split('\n');
}

module.exports = readAllStringsFromFile;
