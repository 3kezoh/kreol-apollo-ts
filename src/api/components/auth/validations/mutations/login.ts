import { MutationLoginArgs, Validator } from "@@api";
import { validationError } from "@utils";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isEmpty } = validator;

const login: Validator<MutationLoginArgs> = ({ email, password }) => {
  const validationErrors = [];
  if (isEmpty(email)) validationErrors.push(validationError("email", "email is empty"));
  if (isEmpty(password)) validationErrors.push(validationError("password", "password is empty"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default login;
