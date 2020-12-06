const Definition = require("../../Definition");

const definitions = async (_, args) => {
  return Definition.find({ ...args }).populate("author");
};

module.exports = definitions;
