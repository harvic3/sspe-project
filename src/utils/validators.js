exports.isValidCharsData = fileData => {
  const pattern = /^[.\s][^A-Za-z0-9!][\s_|\n]+[\s\n]$/gm;
  if (pattern.test(fileData)) {
    return true;
  }
  return false;
};

exports.isValidFileName = fileName => {
  const pattern = /^[0-9a-zA-Z_]+$/g;
  if (pattern.test(fileName)) {
    return true;
  }
  return false;
};

exports.isValidNumber = inputNumber => {
  const pattern = /^[0-9]{5,16}$/g;
  if (pattern.test(inputNumber) && inputNumber <= 9007199254740990) {
    return true;
  }
  return false;
};

exports.isValidFilePath = filePath => {
  const pattern = /^([A-Za-z/\]:|[A-Za-z0-9\\_-]+([A-Za-z0-9_-]+)*)(([A-Za-z0-9_.-]+)+)+(.txt|.dat)$/g;
  if (pattern.test(filePath)) {
    return true;
  }
  return false;
};
