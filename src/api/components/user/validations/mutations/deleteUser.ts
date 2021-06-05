import { MutationDeleteUserArgs, Validator } from "@@api";
import { validationError } from "@utils";
import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";

const deleteUser: Validator<MutationDeleteUserArgs> = ({ id }) => {
  const validationErrors = [];
  if (!isValidObjectId(id)) validationErrors.push(validationError("id", "id is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default deleteUser;
