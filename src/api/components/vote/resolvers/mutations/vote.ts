import { ApolloError } from "apollo-server-express";
import { IVoteDocument, Vote } from "@Vote";
import { Definition } from "@Definition";
import { vote as validate } from "@Vote/validations/mutations";
import pubsub from "@config/pubsub";
import { Resolver, MutationVoteArgs } from "@@api";

const vote: Resolver<MutationVoteArgs, IVoteDocument | null> = async (
  _,
  { definition: id, action },
  { user: voter },
) => {
  validate({ definition: id, action });
  const definition = await Definition.findById(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  const hasVoted = await Vote.findOne({ definition: definition._id, voter: voter?._id });

  if (action || hasVoted) {
    const { score, _id: id } =
      (await Definition.findByIdAndUpdate(
        definition,
        {
          $inc: { score: hasVoted ? action - hasVoted.action : action },
        },
        { new: true },
      )) ?? {};
    pubsub.publish("SCORE", { definition: { score, id } });
  }

  let vote = null;

  if (action) {
    vote = Vote.findOneAndUpdate(
      { voter: voter?._id, definition: definition._id },
      { action },
      { new: true, upsert: true },
    );
  } else if (hasVoted) {
    vote = Vote.findOneAndDelete({ voter: voter?._id, definition: definition._id });
  }

  if (vote) vote = await vote.populate("voter definition");

  if (vote && !action && hasVoted) vote.action = 0;

  return vote;
};

export default vote;
