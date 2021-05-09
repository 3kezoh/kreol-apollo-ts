import dotenv from "dotenv";
import fs from "fs";
import logger from "@config/winston";

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
  logger.info("Using .env file to supply environment variables");
} else if (fs.existsSync(".env.example")) {
  dotenv.config({ path: ".env.example" });
  logger.info("Using .env.example file to supply environment variables");
} else {
  console.error(".env or .env.example missing");
}

const { env } = process;

const google = {
  clientID: env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
};
const jwtSecret = env.JWT_SECRET ?? "";
const port = env.PORT;
const jwtExpiration = parseInt(env.JWT_EXPIRATION ?? "3600000", 10);
const rateLimit = {
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS ?? "900000", 10),
  max: parseInt(env.RATE_LIMIT_MAX ?? "9000", 10),
};
const mongo = {
  uri: (env.NODE_ENV === "production" ? env.MONGODB_URI : env.MONGODB_URI_LOCAL) ?? "",
};

export { google, jwtSecret, jwtExpiration, port, rateLimit, mongo };
