import { QueryPopularArgs, Validator } from "@@api";
import { UserInputError } from "apollo-server-express";
import { validationError } from "@utils";

const popular: Validator<QueryPopularArgs> = ({ letter, limit }) => {
  const validationErrors = [];
  if (letter && ![..."abcdefghijklmnopqrstuvwxyz"].includes(letter))
    validationErrors.push(validationError("letter", "Letter is incorrect"));
  if (limit && limit > 100) validationErrors.push(validationError("limit", "Limit cannot exceed 100"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default popular;
