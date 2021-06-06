import { MutationUpdateUserArgs, Validator } from "@@components";
import { validationError } from "@utils";
import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import validator from "validator";

const { isEmail, isLength } = validator;

const updateUser: Validator<MutationUpdateUserArgs> = ({ id, email, name }) => {
  const validationErrors = [];
  if (!isEmail(email)) validationErrors.push(validationError("email", "email is invalid"));
  if (!isValidObjectId(id)) validationErrors.push(validationError("id", "id is invalid"));
  if (!isLength(name, { min: 2 })) validationErrors.push(validationError("name", "name is too short"));
  if (!isLength(name, { max: 128 })) validationErrors.push(validationError("name", "name is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default updateUser;
