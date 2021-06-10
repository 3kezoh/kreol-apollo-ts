import { MutationReportArgs as TArgs, Validator } from "@@components";
import { validationError } from "@utils";
import { UserInputError } from "apollo-server-express";
import validator from "validator";

const { isLength } = validator;

export const validate: Validator<TArgs> = ({ reason, message }): void => {
  const validationErrors = [];
  if (![0, 1, 2, 3].includes(reason)) validationErrors.push(validationError("reason", "reason is invalid"));
  if (!isLength(message || "", { max: 500 }))
    validationErrors.push(validationError("message", "message is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};
