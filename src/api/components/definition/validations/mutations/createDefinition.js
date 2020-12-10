import { UserInputError } from "apollo-server-express";
import { isEmpty, isLength } from "validator";
import validationError from "../../../../utils/ValidationError";

const createDefinition = ({ word, meaning, example }) => {
  const validationErrors = [];
  if (isEmpty(word)) validationErrors.push(validationError("word", "word is empty"));
  if (isEmpty(meaning)) validationErrors.push(validationError("meaning", "meaning is empty"));
  if (!isLength(meaning, { max: 1500 }))
    validationErrors.push(validationError("meaning", "meaning is too long"));
  if (!isLength(example || "", { max: 1500 }))
    validationErrors.push(validationError("example", "example is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default createDefinition;
