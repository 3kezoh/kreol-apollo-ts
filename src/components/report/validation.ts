import { MutationReportArgs as TArgs, Validator } from "@@components";
import { UserInputError } from "apollo-server-express";
import validator from "validator";
import { MESSAGE, REASON } from "./errors";

const { isLength } = validator;

type validationErrors = { message?: string[]; reason?: string };

export const validate: Validator<TArgs> = ({ reason, message }): void => {
  const validationErrors: validationErrors = { message: [] };
  if (![0, 1, 2, 3].includes(reason)) validationErrors.reason = REASON.INVALID;
  if (!message && reason === 3) validationErrors.message = [MESSAGE.EMPTY];
  if (message && !isLength(message, { max: 500 })) validationErrors.message?.push(MESSAGE.TOO_LONG);
  if (!validationErrors.message?.length) delete validationErrors.message;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
