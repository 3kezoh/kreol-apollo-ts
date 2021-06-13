import { Validator } from "@@components";
import { UserInputError } from "apollo-server-express";
import { ACTION } from "./errors";

export const validate: Validator<{ action: number }> = ({ action }) => {
  const validationErrors: { [i: string]: string } = {};
  if (![-1, 0, 1].includes(action)) validationErrors.action = ACTION.INVALID;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
