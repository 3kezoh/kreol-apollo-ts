const { UserInputError } = require("apollo-server-express");
const { validationError } = require("@utils");

const search = ({ limit }) => {
  const validationErrors = [];
  if (limit > 100) validationErrors.push(validationError("Limit cannot exceed 100"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

export default search;
