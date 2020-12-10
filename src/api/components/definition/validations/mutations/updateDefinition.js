import { UserInputError } from "apollo-server-express";
import { isLength } from "validator";
import { isValidObjectId } from "mongoose";
import validationError from "../../../../utils/ValidationError";

const updateDefinition = ({ id, meaning, example }) => {
  const validationErrors = [];
  if (!isValidObjectId(id)) validationErrors.push(validationError("id", "id is invalid"));
  if (!isLength(meaning || "", { max: 1500 }))
    validationErrors.push(validationError("meaning", "meaning is too long"));
  if (!isLength(example || "", { max: 1500 }))
    validationErrors.push(validationError("example", "example is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default updateDefinition;
