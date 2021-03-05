const { UserInputError } = require("apollo-server-express");
const { isLength } = require("validator");
const { validationError } = require("../../../../utils");

const definitions = ({ filter }) => {
  const { author } = filter;
  const validationErrors = [];
  if (!isLength(author, { min: 2 }))
    validationErrors.push(validationError("author", "author name is too short"));
  if (!isLength(author, { max: 128 }))
    validationErrors.push(validationError("author", "author name is too long"));
  if (validationErrors.length) throw new UserInputError("Validation Error", { validationErrors });
};

module.exports = definitions;
