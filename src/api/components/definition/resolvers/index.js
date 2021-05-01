const mutations = require("./mutations");
const queries = require("./queries");
const subscriptions = require("./subscriptions");

const resolvers = {
  Query: { ...queries },
  Mutation: { ...mutations },
  Subscription: { ...subscriptions },
};

module.exports = resolvers;
