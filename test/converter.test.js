'use strict';

const converter = require('../src/utils/converter');
const os = require('os');
const pattern = os.type() !== 'Windows_NT' ? /\r/gm : null;

const _plainText = `     _   _       _  
  |  _|  _| |_| |_  
  | |_   _|   |  _| 
`;

const _validCharArray = [
  '     _   _       _  ',
  '  |  _|  _| |_| |_  ',
  '  | |_   _|   |  _| ',
];

const _number = 12345;

const _fileData = `     _   _       _  \r
  |  _|  _| |_| |_  \r
  | |_   _|   |  _| \r
`;

describe('When data is in plain text', () => {
  it('Must convert it to valid char array', () => {
    const charArray = converter.plainTextToValidArray(_plainText);
    expect(charArray).toEqual(expect.arrayContaining(_validCharArray));
  });
});

describe('When need a ramdon number', () => {
  it('A number is expected >= 19876', () => {
    const ramdonNumber = converter.generateRandomNumber();
    expect(ramdonNumber).toBeGreaterThanOrEqual(19876);
  });
});

describe('When a number is send', () => {
  it('it is returned in seven-segment format', () => {
    const fileData = converter.generateFileData(_number);
    const validFileData = pattern ? _fileData.replace(pattern, '') : _fileData;
    expect(fileData).toMatch(validFileData);
  });
});
