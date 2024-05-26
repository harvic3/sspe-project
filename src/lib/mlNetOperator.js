'use strict';

const { Result, flowResult } = require('../utils/result.js');
const {
  generateFileData,
  generateRandomNumber,
  plainTextToValidArray,
} = require('../utils/converter.js');
const { saveApplicationFile, readFile } = require('../utils/fileManager.js');
const { isValidCharsData, isValidFilePath } = require('../utils/validators');
const brain = require('brain.js');

const FROM_ROOT_FILES_PATH = '/config';
const TRAINING_DATA_FILE = 'mlTrainingData.json';
const trainingData = require(`../../config/${TRAINING_DATA_FILE}`) || [];
const NET_PARAMS_FILE = 'mlNetParams.json';
let netJson = require(`../../config/${NET_PARAMS_FILE}`) || {};

const config = { errorThresh: 0.005, log: true, logPeriod: 100 };
const net = new brain.recurrent.LSTM();

const transformData = fileData => {
  const data = fileData.replace(/\r\n|\n/gm, '.');
  return data;
};

exports.addDataToTrainingFile = inputNumber => {
  const result = new Result();
  try {
    if (
      inputNumber &&
      isNaN(inputNumber) &&
      inputNumber.toLowerCase() === 'auto'
    ) {
      inputNumber = generateRandomNumber();
    }
    if (inputNumber !== 0 && isNaN(inputNumber)) {
      throw new Error(
        `the input "${inputNumber}" is not a number or "auto" option`
      );
    }
    const fileData = generateFileData(inputNumber);
    const transformedData = transformData(fileData);
    const data = { input: transformedData, output: inputNumber.toString() };
    // const data = { input: fileData, output: inputNumber.toString() };
    if (trainingData) {
      trainingData.push(data);
    }
    saveApplicationFile(
      JSON.stringify(trainingData),
      TRAINING_DATA_FILE,
      FROM_ROOT_FILES_PATH
    );
    console.log(data);
    result.message = 'Data added to the file';
    result.data = fileData;
    result.flow = flowResult.success;
  } catch (error) {
    result.flow = flowResult.failed;
    result.message = error.message;
  }
  return result;
};

exports.trainNet = (iterations, errorThresh) => {
  const result = new Result();
  try {
    if (trainingData && trainingData.lenght < 9) {
      throw new Error(
        `The minimum data to train the net are 10 entries, you have ${trainingData.length} entries currently. Create more entries with "ml add".`
      );
    }
    config.iterations = iterations || 20000;
    if (errorThresh && Number(errorThresh) && errorThresh < 1) {
      config.errorThresh = errorThresh;
    }
    console.log(`Training process start with ${config.iterations} iterations`);
    net.train(trainingData, config);
    netJson = net.toJSON();
    saveApplicationFile(
      JSON.stringify(netJson),
      NET_PARAMS_FILE,
      FROM_ROOT_FILES_PATH
    );
    result.flow = flowResult.success;
    result.message = 'Training process finish';
  } catch (error) {
    result.flow = flowResult.failed;
    result.message = error.message;
  }
  return result;
};

exports.analiceFile = filePath => {
  const result = new Result();
  try {
    if (!netJson?.type) {
      throw new Error('You must train the net to use it!');
    }
    if (!isValidFilePath(filePath)) {
      throw new Error(
        `The fle path "${filePath}" does not have a correct format`
      );
    }
    const fileData = readFile(filePath);
    if (!isValidCharsData(fileData)) {
      throw new Error("The file don't have a valid data");
    }
    // This step verify others conditions
    plainTextToValidArray(fileData);
    net.fromJSON(netJson);
    const transformedData = transformData(fileData);
    const stringNumber = net.run(transformedData);
    // const stringNumber = net.run(fileData);
    result.data = { stringNumber, fileData };
    result.flow = flowResult.success;
  } catch (error) {
    result.flow = flowResult.failed;
    result.message = error.message;
  }
  return result;
};
