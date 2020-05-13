const fs = require('fs');
const path = require('path');

module.exports = {
  saveFile,
  saveJson,
  loadJson,
};

function saveFile(newFileName: string, dirPath: string, buf: any) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  fs.writeFileSync(path.resolve(dirPath, newFileName), buf);
}

function saveJson(json: any, dirPath: string, newFileName: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  fs.writeFileSync(path.resolve(dirPath, newFileName), JSON.stringify(json));
}

function loadJson(dirPath: string, newFileName: string) {
  return fs.readFileSync(path.resolve(dirPath, newFileName), 'utf8');
}
