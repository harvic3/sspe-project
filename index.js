'use strict';

const {
  processFile,
  readFile,
  createNewFile,
  listSavedFiles,
  rebuildExampleFile,
} = require('./src/lib/fileOperator');
const { flowResult } = require('./src/utils/result');
const {
  addDataToTrainingFile,
  trainNet,
  analizeFile,
} = require('./src/lib/mlNetOperator');

const EXAMPLE_FILE_NAME = '/config/ExampleFile.txt';
const EXAMPLE_FILE_PATH = `${__dirname}/${EXAMPLE_FILE_NAME}`;

const evaluateResult = result => {
  if (result.flow === flowResult.failed) {
    console.error(`Error: ${result.message}`);
    process.exit(1);
  }
};

exports.executeExample = () => {
  let result = processFile(EXAMPLE_FILE_PATH);
  if (result.flow == flowResult.failed) {
    result = rebuildExampleFile(EXAMPLE_FILE_NAME);
    if (result.flow == flowResult.success) {
      result = processFile(EXAMPLE_FILE_PATH);
      console.log('The example file had to be rebuilt by the system change.');
    }
  }
  evaluateResult(result);
  return result.data;
};

exports.processFile = filePath => {
  const result = processFile(filePath);
  evaluateResult(result);
  return result.data;
};

exports.readFile = filePath => {
  const result = readFile(filePath);
  evaluateResult(result);
  return result.data;
};

exports.createNewFile = (inputFileName, inputNumber) => {
  const result = createNewFile(inputFileName, inputNumber);
  evaluateResult(result);
  return result.data;
};

exports.listFiles = () =>
  new Promise((resolve, reject) => {
    listSavedFiles()
      .then(result => {
        resolve(result.data);
      })
      .catch(error => {
        reject(evaluateResult(error));
      });
  });

exports.addDataForTraining = inputNumber => {
  const result = addDataToTrainingFile(inputNumber);
  evaluateResult(result);
  return result;
};

exports.doTraining = (iterations, errorThresh) => {
  const result = trainNet(iterations, errorThresh);
  evaluateResult(result);
  return result;
};

exports.analizeFile = filePath => {
  const result = analizeFile(filePath);
  evaluateResult(result);
  return result.data;
};
