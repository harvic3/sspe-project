'use strict';

const os = require('os');

const lineBreak = os.type() === 'Windows_NT' ? '\r\n' : '\n';
const space = '\x20';

// Patterns used for logic
const patterns = {
  p1: `${space}${space}${space}${space}${space}|${space}${space}|`,
  p2: `${space}_${space}${space}_||_${space}`,
  p3: `${space}_${space}${space}_|${space}_|`,
  p4: `${space}${space}${space}|_|${space}${space}|`,
  p5: `${space}_${space}|_${space}${space}_|`,
  p6: `${space}_${space}|_${space}|_|`,
  p7: `${space}_${space}${space}${space}|${space}${space}|`,
  p8: `${space}_${space}|_||_|`,
  p9: `${space}_${space}|_|${space}${space}|`,
  p0: `${space}_${space}|${space}||_|`,
};

exports.patterns = patterns;

const haveTreeOrMoreLines = lines => {
  return lines?.length >= 3;
};

const haveSameLengthPerLine = lines => {
  return !(lines[0].length !== lines[1].length ||
    lines[1].length !== lines[2].length);
};

exports.plainTextToValidArray = fileData => {
  const lines = fileData.split(/\r\n|\n/g);
  if (!haveTreeOrMoreLines(lines)) {
    throw new Error('The amount lines of file isn´t valid.');
  }
  if (!haveSameLengthPerLine(lines)) {
    throw new Error('The size per line in the data file must be the same.');
  }
  return lines;
};

exports.generateRandomNumber = () => {
  const randomNumber = () => {
    return Math.floor(Math.random() * 1000000000000) + 19876;
  };
  let rdmNumber;
  do {
    rdmNumber = randomNumber();
  } while (rdmNumber > 9007199254740990);
  return rdmNumber;
};

exports.generateFileData = inputNumber => {
  let data = '';
  const strNumber = inputNumber.toString();
  const limit = strNumber.length;
  for (let line = 0; line < 3; line++) {
    for (let cursor = 0; cursor < limit; cursor++) {
      const numberToPrint = patterns[`p${strNumber[cursor]}`];
      if (line === 0) {
        data = `${data}${numberToPrint.slice(0, 3)}${space}`;
      } else if (line === 1) {
        data = `${data}${numberToPrint.slice(3, 6)}${space}`;
      } else {
        data = `${data}${numberToPrint.slice(6)}${space}`;
      }
    }
    data = `${data}${lineBreak}`;
  }
  return data;
};
