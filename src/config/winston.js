const winston = require("winston");

const { createLogger, format, transports } = winston;
const { combine, colorize, timestamp, printf } = format;
const { Console } = transports;

const options = {
  console: {
    level: "debug",
    format: combine(
      colorize(),
      timestamp({ format: "D MMM YYYY, HH:mm" }),
      printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
  },
};

const logger = createLogger({
  transports: [new Console(options.console)],
  exitOnError: false,
});

module.exports = logger;
