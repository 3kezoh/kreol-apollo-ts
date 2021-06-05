import { createLogger, format, transports } from "winston";

const { combine, colorize, timestamp, printf } = format;
const { Console } = transports;

const options: transports.ConsoleTransportOptions = {
  level: "debug",
  format: combine(
    colorize(),
    timestamp({ format: "HH:mm" }),
    printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
};

export const logger = createLogger({
  transports: [new Console(options)],
  exitOnError: false,
  silent: process.env.NODE_ENV === "test",
});
