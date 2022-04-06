import { MutationReportArgs as TArgs, Validator } from "@@components";
import { UserInputError } from "apollo-server-express";
import validator from "validator";
import { MESSAGE, REASON } from "./errors";

const { isLength } = validator;

type validationErrors = { message?: string[]; reason?: string };

/**
 * Validates inputs for creating a report
 * @param args an object containing the report's arguments to validate
 * - The reason must be between 0 and 3
 * - If the reason is 3 the message must not be empty
 * - The meaning length must not exceed 300
 * @throws if any validation fails
 */

export const validate: Validator<TArgs> = ({ reason, message }): void => {
  const validationErrors: validationErrors = { message: [] };
  if (![0, 1, 2, 3].includes(reason)) validationErrors.reason = REASON.INVALID;
  if (!message && reason === 3) validationErrors.message = [MESSAGE.EMPTY];
  if (message && !isLength(message, { max: 300 })) validationErrors.message?.push(MESSAGE.TOO_LONG);
  if (!validationErrors.message?.length) delete validationErrors.message;
  if (Object.keys(validationErrors).length)
    throw new UserInputError("Validation Error", { validationErrors });
};
