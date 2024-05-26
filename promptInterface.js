#!/usr/bin/env node
'use-strict';

const path = require('path');
const emojis = require('node-emoji');
const lib = require('./index');
const minimist = require('minimist');
const inquirer = require('inquirer');

const HELP_FILE = './config/help.txt';
const opts = minimist(process.argv.slice(2));
const defaultMessage = `${emojis.get(
  'no_entry'
)} \x20please send a valid command or try with 'hi' or 'example'`;

const launchErrorMessageAndExit = message => {
  console.error(`${emojis.get('warning')}\x20 ${message}`);
  process.exit(1);
};

const checkFileName = fileName => {
  const pattern = /^[0-9a-zA-Z_]+$/;
  if (!pattern.test(fileName)) {
    launchErrorMessageAndExit(
      'the file name can only contain alpha-numeric characters for example "FileName_1"'
    );
  }
  return true;
};

const help = () => {
  let helpFileData = lib.readFile(HELP_FILE);
  const params = helpFileData.match(/(\{\{)(.*?)(\}\})/g).map(word => {
    return word.replace(/{{|}}/g, '');
  });
  for (let index in params) {
    helpFileData = helpFileData.replace(
      `{{${params[index]}}}`,
      `${emojis.get(params[index])}\x20`
    );
  }
  console.log(helpFileData);
};

const showMe = () => {
  console.log(`executing with EXAMPLE file... ${emojis.random().emoji}`);
  console.time('time-process');
  const result = lib.executeExample();
  console.log('File data: ');
  console.log(result.fileData);
  console.log('String number: ');
  console.log(result.stringNumber);
  console.timeEnd('time-process');
};

const createFile = options => {
  if (!options.name) {
    launchErrorMessageAndExit(
      'this option require file "--name" as parameter (without extension file)'
    );
  }
  if (checkFileName(options.name)) {
    if (options.name.toLowerCase().includes('cancel')) {
      console.log('"Cancel" is a reserved work and it can´t be used');
      return;
    }
    const result = lib.createNewFile(options.name, options.number || null);
    console.log(`File ${options.name} created and added to list: `);
    console.log(result);
    console.log('try run "sspe list" for see the files list');
  }
};

const listFiles = async () => {
  const filesList = await lib.listFiles();
  if (!filesList || filesList.length === 0) {
    launchErrorMessageAndExit(
      'There are no previously generated files. Try to generate one with "sspe create --name MyFileName"!'
    );
    return;
  }
  const cancelOption = `CANCEL ${emojis.get('back')}`;
  filesList.push(cancelOption);
  inquirer
    .prompt({
      type: 'list',
      name: 'fileName',
      message: 'Select the file you want to process',
      choices: filesList,
    })
    .then(({ fileName }) => {
      if (fileName === cancelOption) {
        console.log('The action was canceled!');
        return;
      }
      const filePath = path.join(__dirname, `/files/${fileName}`);
      console.log(`Executing with file ${fileName} ${emojis.get('coffee')}`);
      console.time('time-process');
      const result = lib.processFile(filePath);
      console.log('File data: ');
      console.log(result.fileData);
      console.log('String number: ');
      console.log(result.stringNumber);
      console.timeEnd('time-process');
    })
    .catch(error => {
      launchErrorMessageAndExit(
        `Something went wrong. Error: ${error.message}`
      );
    });
};

const processSelectedFile = options => {
  if (!options.path) {
    launchErrorMessageAndExit('this option require file "--path" as parameter');
  }
  console.log(`Executing with file ${options.path} ${emojis.get('coffee')}`);
  console.time('time-process');
  const result = lib.processFile(options.path);
  console.log('File data: ');
  console.log(result.fileData);
  console.log('String number: ');
  console.log(result.stringNumber);
  console.timeEnd('time-process');
};

const addDataForTraining = options => {
  console.log(
    `Adding number ${options.add || 'aleatory'} to training file ${emojis.get(
      'robot_face'
    )}`
  );
  console.time('time-process');
  const result = lib.addDataForTraining(options.add);
  console.log(result.message);
  console.log('File data: ');
  console.log(result.data);
  console.timeEnd('time-process');
};

const doTraining = options => {
  inquirer
    .prompt({
      type: 'confirm',
      name: 'action',
      message: `¿You want to run the network training${
        options.iter ? ' with ' + options.iter.toString() + ' iterations?' : '?'
      }`,
    })
    .then(({ action }) => {
      if (action) {
        console.time('time-process');
        const result = lib.doTraining(options.iter, options.error);
        console.log(result.message);
        console.timeEnd('time-process');
      } else {
        console.log(`Okay, don't panic, nothing's gonna happen.`);
        process.exit(1);
      }
    });
};

const analiceFile = options => {
  console.log(
    `Executing net with file ${options.path} ${emojis.get('coffee')}`
  );
  console.time('time-process');
  const result = lib.analiceFile(options.path);
  console.log('File data: ');
  console.log(result.fileData);
  console.log('String number: ');
  console.log(result.stringNumber);
  console.timeEnd('time-process');
};

const neuralNetWork = options => {
  if (options.add === 0 || options.add) {
    addDataForTraining(options);
    return;
  } else if (options.path) {
    analiceFile(options);
    return;
  } else if (Object.keys(options).length === 1 || options.iter) {
    doTraining(options);
    return;
  }
  launchErrorMessageAndExit(
    'the option for the "ml" action are not recognized.'
  );
};

const noEntry = () => {
  console.log(defaultMessage);
};

const processCommand = async options => {
  const command = options._[0].toLowerCase();
  const selected = {
    hi: help,
    showme: showMe,
    create: createFile,
    list: listFiles,
    select: processSelectedFile,
    ml: neuralNetWork,
    default: noEntry,
  };
  return selected[command] ? selected[command](options) : selected.default();
};

const main = async () => {
  if (!process.argv[2]) {
    console.error(defaultMessage);
    process.exit(1);
  }
  processCommand(opts);
};

main();

// // For debugger only
// (async function main() {
//   // const options = { _: ['create'], name: 'File_Funny', number: 1234567890 };
//   // const options = { _: ['list'] };
//   // const options = { _: ['showme'], };
//   // const options = { _: ['ml'], add: 'auto' };
//   const options = { _: ['hi'] };
//   processCommand(options);
// })();
