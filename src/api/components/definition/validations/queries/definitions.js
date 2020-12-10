import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import validationError from "../../../../utils/ValidationError";

const definitions = ({ filter }) => {
  const { author } = filter;
  const validationErrors = [];
  if (!isValidObjectId(author)) validationErrors.push(validationError("author", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default definitions;
