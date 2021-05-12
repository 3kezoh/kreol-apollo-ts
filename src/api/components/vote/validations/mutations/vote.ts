import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { validationError } from "@utils";
import { Validator, MutationVoteArgs } from "@@api";

const vote: Validator<MutationVoteArgs> = ({ definition, action }) => {
  const validationErrors = [];
  if (!isValidObjectId(definition)) validationErrors.push(validationError("definition", "id is invalid"));
  if (![-1, 0, 1].includes(action)) validationErrors.push(validationError("action", "action is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default vote;
