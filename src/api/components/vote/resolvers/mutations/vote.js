const { ApolloError } = require("apollo-server-express");
const Vote = require("../../Vote");
const { Definition } = require("../../../definition");
const { vote: validate } = require("../../validations/mutations");

const vote = async (_, { definition: id, action }, { user: voter }) => {
  validate({ definition: id, action });
  const definition = await Definition.findById(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  const hasVoted = await Vote.findOne({ definition, voter });

  if (action || hasVoted)
    await Definition.findByIdAndUpdate(definition, {
      $inc: { score: hasVoted ? action - hasVoted.action : action },
    });

  let vote = null;

  if (action) {
    vote = Vote.findOneAndUpdate({ voter, definition }, { action }, { new: true, upsert: true });
  } else if (hasVoted) {
    vote = Vote.findOneAndDelete({ voter, definition });
  }

  if (vote) vote = await vote.populate("voter definition");

  return vote;
};

module.exports = vote;
