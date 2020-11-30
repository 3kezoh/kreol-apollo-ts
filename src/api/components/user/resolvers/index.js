const queries = require("./queries");
const mutations = require("./mutations");

const resolvers = {
  Query: { ...queries },
  Mutation: { ...mutations },
};

module.exports = resolvers;
