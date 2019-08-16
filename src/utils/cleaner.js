'use strict';
const os = require('os');

const pattern = os.type() === 'Windows_NT' ? /\r\n/ : /\n/;

exports.deleteUnnecessaryLines = lines => {
  if (lines && lines.length > 3) {
    return lines.splice(0, 3);
  }
  throw new Error(`The file don´t have a valid data.`);
};

exports.removeLineBreak = lines => {
  lines = lines.map(line => {
    return line.replace(pattern, '');
  });
  return lines;
};
