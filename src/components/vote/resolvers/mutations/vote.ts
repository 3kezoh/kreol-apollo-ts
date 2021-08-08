import { AsyncResolver, DefinitionSubscriptionPayload, MutationVoteArgs as TArgs } from "@@components";
import { DEFINITION } from "@Definition/errors";
import { pubsub } from "@config/pubsub";
import { validate } from "@Vote/validation";
import { IVoteDocument as R } from "@Vote/Vote";
import { ApolloError } from "apollo-server-express";

/**
 * If the action is -1 or 1 or the user has voted for this definition before
 * - Update the score
 * - Publish the new score for Subscribers
 *
 * Then
 *
 * If the action is -1 or 1
 * - Update or Insert the vote
 * Else if the user has voted for this definition before
 * - Remove that vote
 */

/**
 * @resolver
 * @throws if the definition is not found
 */

export const vote: AsyncResolver<TArgs, R | null> = async (_, args, { dataSources }) => {
  const { definition: id, action } = args;
  validate(action);
  const definition = await dataSources.definition.get(id);
  if (!definition) throw new ApolloError(DEFINITION.NOT_FOUND);
  const hasVoted = await dataSources.vote.get(id);

  if (action || hasVoted) {
    const score = hasVoted ? action - hasVoted.action : action;
    const definition = await dataSources.definition.updateScore(id, score);
    if (definition) {
      const { score, _id } = definition;
      const payload: DefinitionSubscriptionPayload = { definition: { score, id: _id.toHexString() } };
      pubsub.publish("SCORE", payload);
    }
  }

  let vote = null;

  if (action) {
    vote = await dataSources.vote.upsert(id, action);
  } else if (hasVoted) {
    vote = await dataSources.vote.remove(id);
  }

  if (vote && !action && hasVoted) vote.action = 0;

  return vote;
};
