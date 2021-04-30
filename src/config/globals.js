const dotenv = require("dotenv");
const fs = require("fs");
const logger = require("@config/winston");

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
  logger.info("Using .env file to supply environment variables");
} else if (fs.existsSync(".env.example")) {
  dotenv.config({ path: ".env.example" });
  logger.info("Using .env.example file to supply environment variables");
} else {
  logger.error(".env or .env.example missing");
}

const { env } = process;

module.exports = {
  env: env.NODE_ENV,
  google: {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  },
  port: env.PORT,
  jwtSecret: env.JWT_SECRET,
  jwtExpiration: parseInt(env.JWT_EXPIRATION, 10),
  mongo: {
    uri: env.NODE_ENV === "production" ? env.MONGODB_URI : env.MONGODB_URI_LOCAL,
  },
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(env.RATE_LIMIT_MAX, 10),
};
