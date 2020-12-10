import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import validationError from "../../../../utils/ValidationError";

const updateDefinition = ({ id }) => {
  const validationErrors = [];
  if (!isValidObjectId(id)) validationErrors.push(validationError("id", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default updateDefinition;
