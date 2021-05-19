import { withFilter } from "apollo-server-express";
import pubsub from "@config/pubsub";
import { DefinitionSubscriptionFilter } from "@@api";

const asyncIterator = () => pubsub.asyncIterator(["SCORE"]);
const filter: DefinitionSubscriptionFilter = ({ definition }, { id }) => definition.id === id;

const definition = {
  subscribe: withFilter(asyncIterator, filter),
};

export default definition;
