const schema = require("./schema");
const typeDefs = require("./typeDefs");

module.exports = {
  typeDefs: [typeDefs],
  schema: { isAuthenticated: schema },
};
