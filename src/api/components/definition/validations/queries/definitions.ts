import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { validationError } from "@utils";
import { QueryDefinitionsArgs } from "@@api/components/definitions";
import { Validator } from "@@api/components";

const definitions: Validator<QueryDefinitionsArgs> = ({ filter, page, limit } = {}): void => {
  const validationErrors = [];
  if (!isValidObjectId(filter?.author)) validationErrors.push(validationError("Author Id is invalid"));
  if (limit && limit > 100) validationErrors.push(validationError("Limit cannot exceed 100"));
  if (page && page < 0) validationErrors.push(validationError("Page cannot be negative"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default definitions;
