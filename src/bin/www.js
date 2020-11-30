const http = require("http");
const app = require("../config/express");
const mongoose = require("../config/mongoose.js");
const PORT = 4000;

app.set("port", PORT);

mongoose.connect();

const server = http.createServer(app);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
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
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.info(`Listening on ${bind} in ${app.get("env")} mode`);
}

server.listen(PORT);
server.on("error", onError);
server.on("listening", onListening);
