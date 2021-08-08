import { MutationUpdateUserArgs as TArgs, Validator } from "@@components";
import { EMAIL, NAME } from "@User/errors";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isEmail, isLength, isAlphanumeric } = validator;

type validationErrors = { name?: string[] } & Partial<Omit<TArgs, "name">>;

/**
 * Validates inputs for updating a user
 * @param args an object containing the user's arguments to validate
 * - The email must be valid
 * - The name must be alphanumeric
 * - The name length must be between 2 and 128
 * @throws if any validation fails
 */

export const updateUser: Validator<TArgs> = ({ email, name }) => {
  const validationErrors: validationErrors = { name: [] };
  if (!isEmail(email)) validationErrors.email = EMAIL.INVALID;
  if (!isAlphanumeric(name)) validationErrors.name = [NAME.NOT_ALPHANUMERIC];
  if (!isLength(name, { min: 2 })) validationErrors.name?.push(NAME.TOO_SHORT);
  if (!isLength(name, { max: 128 })) validationErrors.name?.push(NAME.TOO_LONG);
  if (!validationErrors.name?.length) delete validationErrors.name;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
