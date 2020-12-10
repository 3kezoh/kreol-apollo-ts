const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const Definition = require("./Definition");

module.exports = {
  typeDefs: [typeDefs],
  resolvers,
  Definition,
};
