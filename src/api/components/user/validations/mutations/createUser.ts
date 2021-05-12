import { UserInputError } from "apollo-server-express";
import validator from "validator";
import { validationError } from "@utils";
import { Validator, MutationCreateUserArgs } from "@@api";

const { isEmail, isLength } = validator;

const createUser: Validator<MutationCreateUserArgs> = ({ email, password, name }) => {
  const validationErrors = [];
  if (!isEmail(email)) validationErrors.push(validationError("email", "email is invalid"));
  if (!isLength(password, { min: 8 }))
    validationErrors.push(validationError("password", "password is too short"));
  if (!isLength(password, { max: 128 }))
    validationErrors.push(validationError("password", "password is too long"));
  if (!isLength(name, { min: 2 })) validationErrors.push(validationError("name", "name is too short"));
  if (!isLength(name, { max: 128 })) validationErrors.push(validationError("name", "name is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default createUser;
