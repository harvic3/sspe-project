'use strict';

const path = require('path');
const {
  readFile,
  saveFile,
  readDirectory,
  saveApplicationFile,
} = require('../utils/fileManager');
const { Result, flowResult } = require('../utils/result');
const {
  plainTextToValidArray,
  generateRandomNumber,
  patterns,
  generateFileData,
} = require('../utils/converter');
const { deleteUnnecessaryLines } = require('../utils/cleaner');
const {
  isValidNumber,
  isValidFileName,
  isValidFilePath,
  isValidCharsData,
} = require('../utils/validators');

const NUMBER_OF_PATTERNS = 10;
const FROM_ROOT_FILES_PATH = '/files';
const DIRECTORY_FILES_PATH = `../..${FROM_ROOT_FILES_PATH}`;

const patternsMap = new Map();
const buildPatterns = () => {
  for (let index = 0; index < NUMBER_OF_PATTERNS; index++) {
    patternsMap.set(patterns[`p${index}`], index);
  }
};
buildPatterns();

const evaluateCandidate = (lines, index) => {
  const candidate = lines
    .map(line => {
      return line.slice(index, index + 3);
    })
    .join('');
  return patternsMap.get(candidate) === 0
    ? 0
    : patternsMap.get(candidate) || 'X';
};

const processFileLines = fileLines => {
  const limit = fileLines[0].length;
  const hasMinimunThreeLines = lines => {
    if (lines < 3) {
      throw new Error('File data must have three lines');
    }
  };
  const hasSameLengForLine = (lines, count) => {
    for (let index in lines) {
      if (lines[index].length !== count) {
        throw new Error('The size per line in the data file must be the same.');
      }
    }
  };
  hasMinimunThreeLines(fileLines);
  hasSameLengForLine(fileLines, limit);

  let stringNumber;
  for (let cursor = 0; cursor < limit; cursor += 4) {
    stringNumber = `${stringNumber || ''}${evaluateCandidate(
      fileLines,
      cursor
    )}`;
  }
  return stringNumber;
};

const validateCreateFileParameters = (fileName, inputNumber) => {
  if (!isValidFileName(fileName)) {
    throw new Error(
      'The file name can only contain alpha-numeric characters and "_", for example "FileName_1"'
    );
  }
  if (inputNumber && !isValidNumber(inputNumber)) {
    throw new Error(
      `The number "${inputNumber}" does not have a correct format or not have a valid value`
    );
  }
};

exports.processFile = filePath => {
  const result = new Result();
  filePath = path.normalize(filePath);
  try {
    if (!isValidFilePath(filePath)) {
      throw new Error(
        `The file path "${filePath}" does not have a correct format`
      );
    }
    const fileData = readFile(filePath);
    if (!isValidCharsData(fileData)) {
      throw new Error('The file don´t have a correct format.');
    }
    const fileLines = plainTextToValidArray(fileData);
    const cleanedFileLines = deleteUnnecessaryLines(fileLines);
    const stringNumber = processFileLines(cleanedFileLines);
    result.data = { stringNumber, fileData };
    result.flow = flowResult.success;
  } catch (error) {
    result.flow = flowResult.failed;
    result.message = error.message;
  }
  return result;
};

exports.readFile = filePath => {
  const result = new Result();
  filePath = path.normalize(filePath);
  try {
    result.data = readFile(filePath);
    result.flow = flowResult.success;
  } catch (error) {
    result.message = error.message;
  }
  return result;
};

exports.createNewFile = (fileName, inputNumber) => {
  const result = new Result();
  try {
    validateCreateFileParameters(fileName, inputNumber);
    if (!inputNumber) {
      inputNumber = generateRandomNumber();
    }
    const fileData = generateFileData(inputNumber);
    saveFile(fileData, fileName, FROM_ROOT_FILES_PATH);
    result.data = fileData;
    result.flow = flowResult.success;
  } catch (error) {
    result.message = error.message;
  }
  return result;
};

exports.listSavedFiles = () => {
  return new Promise((resolve, reject) => {
    const result = new Result();
    readDirectory(DIRECTORY_FILES_PATH)
      .then(list => {
        if (list && list.length === 1 && list[0] === '.gitkeep') {
          list = [];
        } else if (list && list.length > 1 && list[0] === '.gitkeep') {
          list = list.slice(1);
        }
        result.data = list;
        result.flow = flowResult.success;
        resolve(result);
      })
      .catch(error => {
        result.message = error.message;
        reject(result);
      });
  });
};

exports.rebuildExampleFile = fileName => {
  const result = new Result();
  try {
    const number = generateRandomNumber();
    const fileData = generateFileData(number);
    saveApplicationFile(fileData, fileName, null);
    result.data = fileData;
    result.flow = flowResult.success;
  } catch (error) {
    result.message = error.message;
  }
  return result;
};
