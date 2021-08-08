import { Validator } from "@@components";
import { UserInputError } from "apollo-server-express";
import { ACTION } from "./errors";

/**
 * Validates inputs for creating a vote
 * @param action the vote's action
 * - The action must be between -1 and 1
 * @throws if the validation fails
 */

export const validate: Validator<number> = (action) => {
  const validationErrors: { [i: string]: string } = {};
  if (![-1, 0, 1].includes(action)) validationErrors.action = ACTION.INVALID;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
