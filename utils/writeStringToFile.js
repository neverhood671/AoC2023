const fs = require('fs');

function writeStringToFile(str, fileName) {
  fs.writeFileSync(fileName, str);
}

module.exports = writeStringToFile;
