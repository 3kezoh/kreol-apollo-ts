import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { Validator, QueryCountArgs } from "@@api";
import { validationError } from "@utils";

const count: Validator<QueryCountArgs> = ({ filter } = {}): void => {
  const validationErrors = [];
  if (!isValidObjectId(filter?.author))
    validationErrors.push(validationError("author", "Author Id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default count;
