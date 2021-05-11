import { withFilter, FilterFn } from "apollo-server-express";
import pubsub from "@config/pubsub";

const asyncIterator = () => pubsub.asyncIterator(["SCORE"]);
const filter: FilterFn = ({ definition }, { id }) => id === definition.id.toString();

const definition = {
  subscribe: withFilter(asyncIterator, filter),
};

export default definition;
