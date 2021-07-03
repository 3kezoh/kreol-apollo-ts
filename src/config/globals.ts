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

export const cookie = {
  name: env.COOKIE_NAME ?? "",
  key: env.COOKIE_KEY ?? "",
  maxAge: parseInt(env.COOKIE_MAX_AGE ?? "86400000", 10),
} as const;

export const google = {
  clientID: env.GOOGLE_CLIENT_ID ?? "",
  clientSecret: env.GOOGLE_CLIENT_SECRET ?? "",
  callbackURL: env.GOOGLE_CALLBACK_URL ?? "",
  successRedirect: env.GOOGLE_SUCCESS_REDIRECT ?? "",
} as const;

export const jwt = {
  secret: env.JWT_SECRET ?? "",
  expiration: env.JWT_EXPIRATION ?? "1m",
} as const;

export const jwrt = {
  secret: env.JWRT_SECRET ?? "",
  expiration: env.JWRT_EXPIRATION ?? "7d",
} as const;

export const port = env.PORT;

export const rateLimitOptions = {
  windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS ?? "900000", 10),
  max: parseInt(env.RATE_LIMIT_MAX ?? "9000", 10),
} as const;

const MONGO_URIS: { [index: string]: string } = {
  production: env.MONGODB_URI ?? "",
  development: env.MONGODB_URI_LOCAL ?? "",
  test: env.MONGODB_URI_TEST ?? "",
} as const;

export const mongo = {
  uri: MONGO_URIS[env.NODE_ENV ?? "development"],
} as const;
