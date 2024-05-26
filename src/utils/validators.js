exports.isValidCharsData = fileData => {
  const pattern = /^[.\s][^A-Za-z0-9!][\s_|\n]+[\s\n]$/gm;
  return !!(pattern.test(fileData));
};

exports.isValidFileName = fileName => {
  const pattern = /^[0-9a-zA-Z_]+$/g;
  return !!(pattern.test(fileName));
};

exports.isValidNumber = inputNumber => {
  const pattern = /^[0-9]{5,16}$/g;
  return !!(pattern.test(inputNumber) && inputNumber <= 9007199254740990);
};

exports.isValidFilePath = filePath => {
  const pattern = /^([A-Za-z/\]:|[A-Za-z0-9\\_-]+([A-Za-z0-9_-]+)*)(([A-Za-z0-9_.-]+)+)+(.txt|.dat)$/g;
  return !!(pattern.test(filePath));
};
