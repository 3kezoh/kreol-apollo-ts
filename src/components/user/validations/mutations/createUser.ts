import { MutationCreateUserArgs as TArgs, Validator } from "@@components";
import { EMAIL, NAME, PASSWORD } from "@User/errors";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isEmail, isLength, isAlphanumeric } = validator;

type validationErrors = { name?: string[] } & Partial<Omit<TArgs, "name">>;

/**
 * Validates inputs for creating a user
 * @param args an object containing the user's arguments to validate
 * - The email must be valid
 * - The password length must be between 8 and 128
 * - The name must be alphanumeric
 * - The name length must be between 2 and 128
 * @throws if any validation fails
 */

export const createUser: Validator<TArgs> = ({ email, password, name }) => {
  const validationErrors: validationErrors = { name: [] };
  if (!isEmail(email)) validationErrors.email = EMAIL.INVALID;
  if (!isLength(password, { min: 8 })) validationErrors.password = PASSWORD.TOO_SHORT;
  if (!isLength(password, { max: 128 })) validationErrors.password = PASSWORD.TOO_LONG;
  if (!isAlphanumeric(name)) validationErrors.name = [NAME.NOT_ALPHANUMERIC];
  if (!isLength(name, { min: 2 })) validationErrors.name?.push(NAME.TOO_SHORT);
  if (!isLength(name, { max: 128 })) validationErrors.name?.push(NAME.TOO_LONG);
  if (!validationErrors.name?.length) delete validationErrors.name;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
