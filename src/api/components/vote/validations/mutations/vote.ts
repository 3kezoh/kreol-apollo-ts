import { UserInputError } from "apollo-server-express";
import { isValidObjectId } from "mongoose";
import { validationError } from "@utils";
// import { FieldValidator } from "@@api/components";

const vote = ({ definition, action }: { definition: string; action: number }): void => {
  const validationErrors = [];
  if (!isValidObjectId(definition)) validationErrors.push(validationError("definition", "id is invalid"));
  if (![-1, 0, 1].includes(action)) validationErrors.push(validationError("action", "action is invalid"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default vote;
