import { QueryDefinitionsArgs, QueryPopularArgs, Validator } from "@@api";
import { validationError } from "@utils";
import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";

type args = QueryDefinitionsArgs & QueryPopularArgs;

const definitionValidation: Validator<args> = ({ filter, letter, page, limit } = {}): void => {
  const validationErrors = [];
  if (filter?.author && !isValidObjectId(filter.author))
    validationErrors.push(validationError("author", "Author Id is invalid"));
  if (letter && ![..."abcdefghijklmnopqrstuvwxyz"].includes(letter))
    validationErrors.push(validationError("letter", "Letter is invalid"));
  if (limit && limit > 100) validationErrors.push(validationError("limit", "Limit cannot exceed 100"));
  if (page && page < 0) validationErrors.push(validationError("page", "Page cannot be negative"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default definitionValidation;
