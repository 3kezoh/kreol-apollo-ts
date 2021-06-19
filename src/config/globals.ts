import { logger } from "@config/winston";
import dotenv from "dotenv";
import fs from "fs";

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

export const google = {
  clientID: env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
};

export const jwt = {
  secret: env.JWT_SECRET ?? "",
  expiration: env.JWT_EXPIRATION ?? "1m",
};

export const jwrt = {
  secret: env.JWRT_SECRET ?? "",
  expiration: env.JWRT_EXPIRATION ?? "7d",
};

export const port = env.PORT;

export const rateLimitOptions = {
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS ?? "900000", 10),
  max: parseInt(env.RATE_LIMIT_MAX ?? "9000", 10),
};

const MONGO_URIS: { [index: string]: string } = {
  production: env.MONGODB_URI ?? "",
  development: env.MONGODB_URI_LOCAL ?? "",
  test: env.MONGODB_URI_TEST ?? "",
};

export const mongo = {
  uri: MONGO_URIS[env.NODE_ENV ?? "development"],
};
