import { MutationLoginArgs as TArgs, Validator } from "@@components";
import { EMAIL, PASSWORD } from "@Auth/errors";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isEmpty } = validator;

export const login: Validator<TArgs> = ({ email, password }) => {
  const validationErrors: Partial<TArgs> = {};
  if (isEmpty(email)) validationErrors.email = EMAIL.EMPTY;
  if (isEmpty(password)) validationErrors.password = PASSWORD.EMPTY;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
