const { withFilter } = require("apollo-server-express");
const pubsub = require("@config/pubsub");

const asyncIterator = () => pubsub.asyncIterator(["SCORE"]);
const filter = ({ definition }, { ids }) => ids.includes(definition.id.toString());

const definition = {
  subscribe: withFilter(asyncIterator, filter),
};

module.exports = definition;
