import { MutationVoteArgs, Resolver } from "@@api";
import pubsub from "@config/pubsub";
import { IUserDocument } from "@User";
import { IVoteDocument } from "@Vote";
import { vote as validate } from "@Vote/validations/mutations";
import { ApolloError } from "apollo-server-express";

const vote: Resolver<MutationVoteArgs, IVoteDocument | null> = async (
  _,
  { definition: id, action },
  { user: voter, dataSources },
) => {
  validate({ definition: id, action });
  const definition = await dataSources.definition.get(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  const hasVoted = await dataSources.vote.get(definition._id, (voter as IUserDocument)._id);

  if (action || hasVoted) {
    const { score, _id: id } = await definition.updateScore(hasVoted ? action - hasVoted.action : action);
    pubsub.publish("SCORE", { definition: { score, id } });
  }

  let vote = null;

  if (action) {
    vote = await dataSources.vote.upsert(definition._id, (voter as IUserDocument)._id, action);
  } else if (hasVoted) {
    vote = await dataSources.vote.delete(definition._id, (voter as IUserDocument)._id);
  }

  if (vote && !action && hasVoted) vote.action = 0;

  return vote;
};

export default vote;
