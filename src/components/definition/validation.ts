import { MutationCreateDefinitionArgs as TArgs, Validator } from "@@components";
import { UserInputError } from "apollo-server-express";
import validator from "validator";
import { EXAMPLE, LANGUAGE, MEANING, WORD } from "./errors";

const { isEmpty, isLength, isIn } = validator;

/**
 * Validates inputs for creating a definition
 * @param args an object containing the definition's arguments to validate
 * - The word must not be empty
 * - The meaning must not be empty
 * - The meaning length must not exceed 1500
 * - The language must be either fr or gf
 * @throws if any validation fails
 */

export const validate: Validator<TArgs> = ({ word, meaning, example, language }) => {
  const validationErrors: Partial<TArgs> = {};
  if (isEmpty(word)) validationErrors.word = WORD.EMPTY;
  if (isEmpty(meaning)) validationErrors.meaning = MEANING.EMPTY;
  if (!isLength(meaning, { max: 1500 })) validationErrors.meaning = MEANING.TOO_LONG;
  if (example && !isLength(example, { max: 1500 })) validationErrors.example = EXAMPLE.TOO_LONG;
  if (!isIn(language, ["fr", "gf"])) validationErrors.language = LANGUAGE.FR_GF;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
