const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { schema } = require("@@apollo");
const logger = require("@config/winston");

const onConnect = () => logger.info("Client connected");
const onDisconnect = () => logger.info("Client disconnected");

const subscriptionServer = (server) =>
  new SubscriptionServer(
    { execute, subscribe, schema, onConnect, onDisconnect },
    { server, path: "/subscriptions" }
  );

module.exports = subscriptionServer;
