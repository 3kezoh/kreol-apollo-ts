import { Validator } from "@@components";
import { validationError } from "@utils";
import { UserInputError } from "apollo-server-express";

export const validate: Validator<{ action: number }> = ({ action }) => {
  const validationErrors = [];
  if (![-1, 0, 1].includes(action)) validationErrors.push(validationError("action", "action is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};