const { UserInputError } = require("apollo-server-express");
const { isEmpty, isLength, isIn } = require("validator");
const { validationError } = require("../../../../utils");

const createDefinition = ({ word, meaning, example, language }) => {
  const validationErrors = [];
  if (isEmpty(word)) validationErrors.push(validationError("word", "word is empty"));
  if (isEmpty(meaning)) validationErrors.push(validationError("meaning", "meaning is empty"));
  if (!isLength(meaning, { max: 1500 }))
    validationErrors.push(validationError("meaning", "meaning is too long"));
  if (!isLength(example || "", { max: 1500 }))
    validationErrors.push(validationError("example", "example is too long"));
  if (isEmpty(language)) validationErrors.push(validationError("language", "language is empty"));
  if (!isIn(language, ["fr", "gy"]))
    validationErrors.push(validationError("language", "language can only be fr or gy"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = createDefinition;
