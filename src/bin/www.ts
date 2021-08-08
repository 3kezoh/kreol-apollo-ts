/**
 * This file is the entry point of the project, after setting up the app port
 * and database connection, it creates an HTTP server which is then attached
 * to a WebSocket server
 */

import "module-alias/register";
import { app, logger, mongoose, subscriptionServer } from "@config";
import { mongo, port } from "@config/globals";
import chalk from "chalk";
import http from "http";

app.set("port", port);

mongoose.connect(mongo.uri);

const server = http.createServer(app);

/**
 * express-generator
 * throw if the port is already in use or requires elevated privileges
 */

const onError = (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * express-generator
 * Log the port and environment (production, development or test)
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
  logger.info(`Listening on ${bind} in ${chalk.magenta(app.get("env"))} mode`);
};

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

subscriptionServer(server);
