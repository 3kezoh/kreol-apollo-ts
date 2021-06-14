import { MutationUpdateUserArgs as TArgs, Validator } from "@@components";
import { EMAIL, NAME } from "@User/errors";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isEmail, isLength, isAlphanumeric } = validator;

type validationErrors = { name?: string[] } & Partial<Omit<TArgs, "name">>;

export const updateUser: Validator<TArgs> = ({ email, name }) => {
  const validationErrors: validationErrors = { name: [] };
  if (!isEmail(email)) validationErrors.email = EMAIL.INVALID;
  if (!isAlphanumeric(name)) validationErrors.name = [NAME.NOT__ALPHANUMERIC];
  if (!isLength(name, { min: 2 })) validationErrors.name?.push(NAME.TOO_SHORT);
  if (!isLength(name, { max: 128 })) validationErrors.name?.push(NAME.TOO_LONG);
  if (!validationErrors.name?.length) delete validationErrors.name;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
