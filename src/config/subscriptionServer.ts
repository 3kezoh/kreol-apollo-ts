import { schema } from "@config/apollo";
import { logger } from "@config/winston";
import { execute, subscribe } from "graphql";
import http from "http";
import { SubscriptionServer } from "subscriptions-transport-ws";

const onConnect = () => logger.info("Subscription Client connected");
const onDisconnect = () => logger.info("Subscription Client disconnected");

export const subscriptionServer = (server: http.Server): void => {
  SubscriptionServer.create(
    { execute, subscribe, schema, onConnect, onDisconnect },
    { server, path: "/subscriptions" },
  );
};
