const fs = require('fs');

function readFileToString(filePath) {
  return fs
    .readFileSync(filePath)
    .toString('utf-8')
    .split('\n');
}

module.exports = readFileToString;
