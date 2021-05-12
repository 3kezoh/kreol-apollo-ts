import http from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { schema } from "@config/apollo";
import logger from "@config/winston";

const onConnect = () => logger.info("Client connected");
const onDisconnect = () => logger.info("Client disconnected");

const subscriptionServer = (server: http.Server): void => {
  SubscriptionServer.create(
    { execute, subscribe, schema, onConnect, onDisconnect },
    { server, path: "/subscriptions" },
  );
};

export default subscriptionServer;
