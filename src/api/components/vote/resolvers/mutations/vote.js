const { model } = require("mongoose");
const { ApolloError } = require("apollo-server-express");
const { vote: validate } = require("@Vote/validations/mutations");
const pubsub = require("@config/pubsub");

const Vote = model("Vote");
const Definition = model("Definition");

const vote = async (_, { definition: id, action }, { user: voter }) => {
  validate({ definition: id, action });
  const definition = await Definition.findById(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  const hasVoted = await Vote.findOne({ definition, voter });

  if (action || hasVoted) {
    const { score, _id: id } = await Definition.findByIdAndUpdate(
      definition,
      {
        $inc: { score: hasVoted ? action - hasVoted.action : action },
      },
      { new: true },
    );
    pubsub.publish("SCORE", { definition: { score, id } });
  }

  let vote = null;

  if (action) {
    vote = Vote.findOneAndUpdate({ voter, definition }, { action }, { new: true, upsert: true });
  } else if (hasVoted) {
    vote = Vote.findOneAndDelete({ voter, definition });
  }

  if (vote) vote = await vote.populate("voter definition");

  if (!action && hasVoted) vote.action = 0;

  return vote;
};

export default vote;
