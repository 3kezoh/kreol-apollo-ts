import { UserInputError } from "apollo-server-express";
import { validationError } from "@utils";
import { Validator, QuerySearchArgs } from "@@api";

const search: Validator<QuerySearchArgs> = ({ limit }) => {
  const validationErrors = [];
  if (limit && limit > 100) validationErrors.push(validationError("limit", "Limit cannot exceed 100"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default search;
