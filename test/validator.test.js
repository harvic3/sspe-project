'use strict';

const validator = require('../src/utils/validators');

const _validFilePathUnix1 = 'E:/MyFiles/Foo_File.txt';
const _validFilePathUnix2 = '/Users/onepc/Documents/MyFunny.file.test.txt';
const _validFilePathDos1 = 'E:\\Repos\\test-psl\\TestFile.txt';
const _validFilePathDos2 = 'E:/GhostFolder\\SuperFile.dat';
const _invalidFilePathUnix = 'E:/GhostFolder/Invalid#.Path.dat';
const _invalidFilePathDos = 'E:\\GhostFolder\\Invalid#.Path.dat';

describe('When Unix path is valid', () => {
  it('Validation file path 1 is true', () => {
    const valid = validator.isValidFilePath(_validFilePathUnix1);
    expect(valid).toBeTruthy();
  });
  it('Validation file path 2 is true', () => {
    const valid = validator.isValidFilePath(_validFilePathUnix2);
    expect(valid).toBeTruthy();
  });
});

describe('When Dos path is valid', () => {
  it('Validation file path 1 is true', () => {
    const valid = validator.isValidFilePath(_validFilePathDos1);
    expect(valid).toBeTruthy();
  });
  it('Validation file path 2 is true', () => {
    const valid = validator.isValidFilePath(_validFilePathDos2);
    expect(valid).toBeTruthy();
  });
});

describe('When path is NOT valid', () => {
  it('Validation Unix file path is false', () => {
    const valid = validator.isValidFilePath(_invalidFilePathUnix);
    expect(valid).toBeFalsy;
  });
  it('Validation Dos file path is false', () => {
    const valid = validator.isValidFilePath(_invalidFilePathDos);
    expect(valid).toBeFalsy;
  });
});

const _validFileName = 'MyFunny_File';
const _invalidFileName = 'My#FooFile.dat';

describe('When file name is valid', () => {
  it('Validation file name is true', () => {
    const valid = validator.isValidFileName(_validFileName);
    expect(valid).toBeTruthy();
  });
});

describe('When file name is NOT valid', () => {
  it('Validation file name is false', () => {
    const valid = validator.isValidFileName(_invalidFileName);
    expect(valid).toBeFalsy;
  });
});

const _validCharData = `     _   _       _  
|  _|  _| |_| |_  
| |_   _|   |  _| 
`;
const _invalidCharData =
  '   A  _   _    0   _  |  _|  _| |_| |_  | |_   _|   |  _| ';

describe('When file data is valid', () => {
  it('Validation of chars data is true', () => {
    const valid = validator.isValidCharsData(_validCharData);
    expect(valid).toBeTruthy();
  });
});

describe('When file data is NOT valid', () => {
  it('Validation of chars data is false', () => {
    const valid = validator.isValidCharsData(_invalidCharData);
    expect(valid).toBeFalsy;
  });
});

const _validNumber = 123456;
const _invalidNumber = '1234A45';
const _mayoNumber = 9007199254740992;

describe('When input number is valid', () => {
  it('Validation numbers is true', () => {
    const valid = validator.isValidNumber(_validNumber);
    expect(valid).toBeTruthy();
  });
});

describe('When input number is mayor 9007199254740990', () => {
  it('Validation numbers is false', () => {
    const valid = validator.isValidNumber(_invalidNumber);
    expect(valid).toBeFalsy;
  });
});

describe('When input number is NOT valid', () => {
  it('Validation numbers is false', () => {
    const valid = validator.isValidNumber(_mayoNumber);
    expect(valid).toBeFalsy;
  });
});
