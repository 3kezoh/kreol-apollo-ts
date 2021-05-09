const { UserInputError } = require("apollo-server-express");
const { validationError } = require("@utils");

const popular = ({ letter, limit }) => {
  const validationErrors = [];
  if (![..."abcdefghijklmnopqrstuvwxyz"].includes(letter))
    validationErrors.push(validationError("Letter is incorrect"));
  if (limit > 100) validationErrors.push(validationError("Limit cannot exceed 100"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default popular;
