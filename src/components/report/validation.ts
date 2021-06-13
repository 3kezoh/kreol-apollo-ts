import { MutationReportArgs as TArgs, Validator } from "@@components";
import { UserInputError } from "apollo-server-express";
import validator from "validator";
import { MESSAGE, REASON } from "./errors";

const { isLength } = validator;

export const validate: Validator<TArgs> = ({ reason, message }): void => {
  const validationErrors: { [i: string]: string } = {};
  if (![0, 1, 2, 3].includes(reason)) validationErrors.reason = REASON.INVALID;
  if (message && !isLength(message, { max: 500 })) validationErrors.message = MESSAGE.TOO_LONG;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
