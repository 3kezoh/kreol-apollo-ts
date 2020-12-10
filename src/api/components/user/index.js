const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const User = require("./User");

module.exports = {
  typeDefs: [typeDefs],
  resolvers,
  User,
};
