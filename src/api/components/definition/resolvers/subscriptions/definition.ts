import { DefinitionSubscriptionFilter } from "@@api";
import { pubsub } from "@config";
import { withFilter } from "apollo-server-express";

const asyncIterator = () => pubsub.asyncIterator(["SCORE"]);
const filter: DefinitionSubscriptionFilter = ({ definition }, { id }) => definition.id === id;

export const definition = {
  subscribe: withFilter(asyncIterator, filter),
};
