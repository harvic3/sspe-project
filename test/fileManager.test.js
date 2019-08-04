'use strict';

jest.mock('fs');
require('fs').__setMockFiles(null);
const fs = require('fs');
const path = require('path');

const _fileData = `     _   _       _  
  |  _|  _| |_| |_  
  | |_   _|   |  _| 
`;

describe('When read an existing file path', () => {
  it('Must return the string data', () => {
    const fileManager = require('../src/utils/fileManager');
    const fileData = fileManager.readFile('E:/Docs/TestFile.txt');
    expect.stringContaining(fileData);
  });
});

describe('When read a directory', () => {
  it('Must return an array with two file names', () => {
    const DIRECTORY_FILES = 'E:/Docs/files';
    jest.mock('../src/utils/fileManager.js');
    const fileManager = require('../src/utils/fileManager');
    fileManager.readDirectory.mockReturnValue(
      Promise.resolve(fs.readdirSync(DIRECTORY_FILES))
    );
    fileManager
      .readDirectory(DIRECTORY_FILES)
      .then(fileNames => {
        expect(fileNames.length).toBe(2);
      })
      .catch(error => {
        console.log(error);
      });
  });
});

describe('When save a file that no exists', () => {
  it('Must save the file', () => {
    const FILE_PATH = 'E:/Docs/NewFile.txt';
    const FILE_NAME = path.dirname(FILE_PATH);
    const fileData = _fileData;
    jest.mock('../src/utils/fileManager.js');
    const fileManager = require('../src/utils/fileManager');
    fileManager.saveFile.mockReturnValue(fs.writeFileSync(FILE_PATH, fileData));
    expect(fileManager.saveFile(fileData, FILE_NAME, null)).toBeUndefined();
  });
});

describe('When save a application file', () => {
  it('Must append or add the file', () => {
    const FILE_PATH = 'E:/Docs/NewFile.txt';
    const FILE_NAME = path.dirname(FILE_PATH);
    const fileData = _fileData;
    jest.mock('../src/utils/fileManager.js');
    const fileManager = require('../src/utils/fileManager');
    fileManager.saveApplicationFile.mockReturnValue(
      fs.appendFileSync(FILE_PATH, fileData)
    );
    expect(
      fileManager.saveApplicationFile(fileData, FILE_NAME, null)
    ).toBeUndefined();
  });
});
