require("module-alias/register");
const http = require("http");
const logger = require("@config/winston");
const mongoose = require("@config/mongoose");
const app = require("@config/express");
const { port } = require("@config/globals");

app.set("port", port);

mongoose.connect();

const server = http.createServer(app);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind} in ${app.get("env")} mode`);
}

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
