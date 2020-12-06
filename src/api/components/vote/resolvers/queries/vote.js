const Vote = require("../../Vote");
const { vote: validate } = require("../../validations/queries");

const vote = (_, { definition }, { user: voter }) => {
  validate({ definition });
  const vote = Vote.findOne({ voter, definition }).populate("voter definition");
  return vote;
};

module.exports = vote;
