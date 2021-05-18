import { MutationCreateDefinitionArgs, Validator } from "@@api";
import { validationError } from "@utils";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isEmpty, isLength, isIn } = validator;

const createDefinition: Validator<MutationCreateDefinitionArgs> = ({ word, meaning, example, language }) => {
  const validationErrors = [];
  if (isEmpty(word)) validationErrors.push(validationError("word", "word is empty"));
  if (isEmpty(meaning)) validationErrors.push(validationError("meaning", "meaning is empty"));
  if (!isLength(meaning, { max: 1500 }))
    validationErrors.push(validationError("meaning", "meaning is too long"));
  if (!isLength(example || "", { max: 1500 }))
    validationErrors.push(validationError("example", "example is too long"));
  if (isEmpty(language)) validationErrors.push(validationError("language", "language is empty"));
  if (!isIn(language, ["fr", "gf"]))
    validationErrors.push(validationError("language", "language can only be fr or gf"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default createDefinition;
