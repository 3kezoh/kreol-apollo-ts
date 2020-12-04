const Definition = require("../../Definition");

const definitions = async () => {
  return Definition.find().populate("author");
};

module.exports = definitions;
