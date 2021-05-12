import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { validationError } from "@utils";
import { QueryReportsArgs, Validator } from "@@api";

const reports: Validator<QueryReportsArgs> = ({ definition }) => {
  const validationErrors = [];
  if (!isValidObjectId(definition)) validationErrors.push(validationError("definition", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default reports;
