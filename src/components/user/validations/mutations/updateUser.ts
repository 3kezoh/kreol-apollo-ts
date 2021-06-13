import { MutationUpdateUserArgs as TArgs, Validator } from "@@components";
import { EMAIL, NAME } from "@User/errors";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isEmail, isLength } = validator;

export const updateUser: Validator<TArgs> = ({ email, name }) => {
  const validationErrors: Partial<TArgs> = {};
  if (!isEmail(email)) validationErrors.email = EMAIL.INVALID;
  if (!isLength(name, { min: 2 })) validationErrors.name = NAME.TOO_SHORT;
  if (!isLength(name, { max: 128 })) validationErrors.name = NAME.TOO_LONG;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
