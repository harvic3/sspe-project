# SSPE

> CLI application to process text files with numbers in seven-segment format in three lines of text files (.dat || .txt) 

```console
$ sspe showme
executing with EXAMPLE file... ✏️
File data:
 _       _   _   _       _   _   _   _       _
  |   | |_|   | |_| |_| |_  |_| |_| |_|   | |_|
  |   | |_|   |   |   |  _| |_|   | |_|   |   |

String number:
718794589819
time-process: 2.896ms
```

## Environment

> This application was made for the NodeJs runtime environment.

## Installation

- Clone the repository
- Open your favorite terminal and go to the project root directory and Run the following commands:

```console
npm install
```

```console
npm link
```

- and for get help

```console
sspe hi
```

## Plus -> machine learning (is experimental)

> Use a neural network (LSTM) to process the text files and throw a string with the result equivalent to the number contained in seven-segment format within the file.

> The neural network can be trained, you can create data for the training too and process files with the last training done.

## Test (it's in process)

> Part of the code of this application is covered by unit tests and the idea is to add the missing ones as they are finished.

- Execute tests

```console
npm run test
```

## Usage

- Get help

```console
sspe hi
```

- Run process with example file

```console
sspe showme
```

- Create a file with seven-segments format

```console
sspe create --name theFileName --number 31039064
```

- List the created files

```console
sspe list
```

- Select a local file for process

```console
sspe select --path D:/Test/Foo.dat
```

- Add data for train the neural network

```console
sspe ml --add 310390 OR sspe m --add auto
```

- Training the neural network

```console
sspe ml --iter 25000 OR sspe ml
```

- Select a local file for process with Neural network

```console
sspe ml --path D:/Test/Foo.txt
```

## File Structure

```
root
|_src
| |__lib // Contains the business logic
| |__utils // Contains utilities to support business logic
|__test // Contains the unit tests
```

## Alternative algorithm but slower

This was the first algorithm designed, then I decided to improve it and the new version looked so much better.

```js
// File /lib/fileOperator.js

// these patterns are only informative, it is the basis that was taken for the processing of the text
// Patterns used for logic 1
/*const patterns  = {
 one: ['d','e'], // Length 2
 seven: ['c','d','e'], // Length 3
 four: ['a','b','d','e'], // Length 4
 two: ['a','c','d','f','g'], // Length 5
 nine: ['a','b','c','d','e'], // Length 5
 five: ['a','b','c','e','f'], // Length 5
 three: ['a','c','d','e','f'], // Length 5
 zero: ['b','c','d','e','f','g'], // Length 6
 six: ['a','b','c','e','f','g'], // Length 6
 eight: ['a','b','c','d','e','f','g'], // Length 7
}*/

const evaluateCandidate = candidate => {
  const numberOfSegments = candidate.length;
  switch (numberOfSegments) {
    case 2:
      return '1';
    case 3:
      return '7';
    case 4:
      return '4';
    case 5:
      if (candidate[4] === 'e') {
        return '9';
      } else if (candidate[4] === 'g') {
        return '2';
      } else if (candidate[1] === 'b') {
        return '5';
      }
      return '3';
    case 6:
      if (candidate[0] === 'b') {
        return '0';
      }
      return '6';
    case 7:
      return '8';
    default:
      return 'X';
  }
};

const createCandidate = (fileLines, cursor) => {
  let candidate = [];
  const supLine = fileLines[0].slice(cursor, cursor + 3);
  const midLine = fileLines[1].slice(cursor, cursor + 3);
  const lowLine = fileLines[2].slice(cursor, cursor + 3);
  if (supLine === '._.') {
    candidate.push('c');
  }

  switch (midLine) {
    case '..|':
      candidate.push('d');
      break;
    case '._|':
      candidate.push('a');
      candidate.push('d');
      break;
    case '|_.':
      candidate.push('a');
      candidate.push('b');
      break;
    case '|.|':
      candidate.push('b');
      candidate.push('d');
      break;
    case '|_|':
      candidate.push('a');
      candidate.push('b');
      candidate.push('d');
      break;
  }

  switch (lowLine) {
    case '..|':
      candidate.push('e');
      break;
    case '._|':
      candidate.push('e');
      candidate.push('f');
      break;
    case '|_.':
      candidate.push('f');
      candidate.push('g');
      break;
    case '|.|':
      candidate.push('e');
      candidate.push('g');
      break;
    case '|_|':
      candidate.push('e');
      candidate.push('f');
      candidate.push('g');
      break;
  }
  return candidate.sort();
};

const processFileLines = fileLines => {
  const limit = fileLines[0].length;
  let stringNumber;
  for (let cursor = 0; cursor < limit; cursor += 4) {
    let candidate = createCandidate(fileLines, cursor);
    stringNumber = `${stringNumber || ''}${evaluateCandidate(candidate)}`;
  }
  return stringNumber;
};

exports.processFile = filePath => {
  const result = new Result();
  try {
    if (!isValidFilePath(filePath)) {
      throw new Error(
        `the fle path '${filePath}" does not have a correct format`
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
```
