'use strict';

const path = require('path');

const fs = jest.genMockFromModule('fs');

const _customDirectory = path.resolve(__dirname, '../../files/');
let _customFiles = {
  'E:/Docs/TestFile.txt': `     _   _       _  
  |  _|  _| |_| |_  
  | |_   _|   |  _| 
`,
  'E:/Docs/mlTrainingData.json': [],
  'E:/Docs/mlNetParams.json': {},
  'E:/Docs/files/My_File_One.txt': ` _   _   _   _   _  
  |_| |_|   | |_  |_  
    | |_|   | |_|  _| 
  `,
  'E:/Docs/files/My_File_two.txt': ` _   _   _   _   _  
  |_  |_    | |_| |_| 
   _| |_|   | |_|   | 
  `,
};

let mockFiles = Object.create(null);

const __setMockFiles = newMockFiles => {
  mockFiles = Object.create(null);
  if (!newMockFiles) {
    newMockFiles = _customFiles;
  }
  for (const file in newMockFiles) {
    const dir = path.dirname(file);
    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
};

const existsSync = filePath => {
  let exists;
  const directoryPath = path.dirname(filePath);
  const fileName = path.basename(filePath);
  if (mockFiles[directoryPath]) {
    const files = mockFiles[directoryPath];
    if (files && files.length > 0) {
      exists = files.find(file => {
        return file === fileName;
      });
    }
  }
  return exists ? true : false;
};

const readdirSync = directoryPath => {
  if (!directoryPath) {
    directoryPath = _customDirectory;
  }
  return mockFiles[directoryPath] || [];
};

const readFileSync = dirPath => {
  return _customFiles[dirPath] || null;
};

const writeFileSync = (filePath, fileData) => {
  const directoryPath = path.dirname(filePath);
  const fileName = path.basename(filePath);
  if (!mockFiles[directoryPath]) {
    mockFiles[directoryPath] = [];
  }
  mockFiles[directoryPath].push(path.basename(fileName));
  _customFiles[filePath] = null;
  _customFiles[filePath] = fileData;
  return;
};

const appendFileSync = (filePath, fileData) => {
  const directoryPath = path.dirname(filePath);
  const fileName = path.basename(filePath);
  if (!mockFiles[directoryPath]) {
    mockFiles[directoryPath] = [];
  }
  mockFiles[directoryPath].push(path.basename(fileName));
  _customFiles[filePath] = null;
  _customFiles[filePath] = fileData;
  return;
};

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.existsSync = existsSync;
fs.readFileSync = readFileSync;
fs.writeFileSync = writeFileSync;
fs.appendFileSync = appendFileSync;

module.exports = fs;
