/* istanbul ignore file */

import { DefinitionSubscriptionFilter } from "@@components";
import { pubsub } from "@config/pubsub";
import { withFilter } from "graphql-subscriptions";

// https://www.apollographql.com/docs/apollo-server/data/subscriptions/

const asyncIterator = () => pubsub.asyncIterator(["SCORE"]);
const filter: DefinitionSubscriptionFilter = ({ definition }, { id }) => definition.id === id;

export const definition = {
  subscribe: withFilter(asyncIterator, filter),
};
