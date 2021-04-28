const { model } = require("mongoose");
const { vote: validate } = require("@Vote/validations/queries");

const Vote = model("Vote");

const vote = async (_, { definition }, { user: voter }) => {
  validate({ definition });
  const vote = Vote.findOne({ voter, definition }).populate("voter definition");
  return vote;
};

module.exports = vote;
