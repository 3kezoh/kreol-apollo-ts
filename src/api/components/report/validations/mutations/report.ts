import { UserInputError } from "apollo-server-express";
import validator from "validator";
import { isValidObjectId } from "mongoose";
import { validationError } from "@utils";
import { MutationReportArgs, Validator } from "@@api";

const { isLength } = validator;

const report: Validator<MutationReportArgs> = ({ definition, reason, message }) => {
  const validationErrors = [];
  if (!isValidObjectId(definition)) validationErrors.push(validationError("definition", "id is invalid"));
  if (![0, 1, 2, 3].includes(reason)) validationErrors.push(validationError("reason", "reason is invalid"));
  if (!isLength(message || "", { max: 500 }))
    validationErrors.push(validationError("example", "example is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default report;
