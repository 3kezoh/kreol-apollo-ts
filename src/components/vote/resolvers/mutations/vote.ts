import { DefinitionSubscriptionPayload, MutationVoteArgs, Resolver } from "@@components";
import { pubsub } from "@config/pubsub";
import { IUserDocument } from "@User";
import { validate } from "@Vote/validation";
import { IVoteDocument } from "@Vote/Vote";
import { ApolloError } from "apollo-server-express";

type voteResolver = Resolver<MutationVoteArgs, IVoteDocument | null>;

export const vote: voteResolver = async (_, { definition: id, action }, { user: voter, dataSources }) => {
  validate({ action });
  const definition = await dataSources.definition.get(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  const hasVoted = await dataSources.vote.get(definition._id, (voter as IUserDocument)._id);

  if (action || hasVoted) {
    const score = hasVoted ? action - hasVoted.action : action;
    const _definition = await dataSources.definition.updateScore(definition._id, score);
    if (_definition) {
      const { score, _id } = _definition;
      const payload: DefinitionSubscriptionPayload = { definition: { score, id: _id.toHexString() } };
      pubsub.publish("SCORE", payload);
    }
  }

  let vote = null;

  if (action) {
    vote = await dataSources.vote.upsert(definition._id, (voter as IUserDocument)._id, action);
  } else if (hasVoted) {
    vote = await dataSources.vote.remove(definition._id, (voter as IUserDocument)._id);
  }

  if (vote && !action && hasVoted) vote.action = 0;

  return vote;
};
