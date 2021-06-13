import { MutationCreateUserArgs as TArgs, Validator } from "@@components";
import { EMAIL, NAME, PASSWORD } from "@User/errors";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isEmail, isLength } = validator;

export const createUser: Validator<TArgs> = ({ email, password, name }) => {
  const validationErrors: Partial<TArgs> = {};
  if (!isEmail(email)) validationErrors.email = EMAIL.INVALID;
  if (!isLength(password, { min: 8 })) validationErrors.password = PASSWORD.TOO_SHORT;
  if (!isLength(password, { max: 128 })) validationErrors.password = PASSWORD.TOO_LONG;
  if (!isLength(name, { min: 2 })) validationErrors.name = NAME.TOO_SHORT;
  if (!isLength(name, { max: 128 })) validationErrors.name = NAME.TOO_LONG;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
