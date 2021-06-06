import { DefinitionSubscriptionFilter } from "@@components";
import { pubsub } from "@config/pubsub";
import { withFilter } from "apollo-server-express";

const asyncIterator = () => pubsub.asyncIterator(["SCORE"]);
const filter: DefinitionSubscriptionFilter = ({ definition }, { id }) => definition.id === id;

export const definition = {
  subscribe: withFilter(asyncIterator, filter),
};
