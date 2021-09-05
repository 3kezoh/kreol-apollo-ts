import { logger } from "@config/winston";
import dotenv from "dotenv";
import { existsSync } from "fs";

const PATH = ".env.example";

if (existsSync(PATH)) {
  dotenv.config({ path: PATH });
  logger.info(`Using ${PATH} file to supply environment variables`);
}

const { env } = process;

export const cookie = {
  name: env.COOKIE_NAME,
  key: env.COOKIE_KEY,
  maxAge: env.COOKIE_MAX_AGE,
} as const;

export const google = {
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_CALLBACK_URL,
  successRedirect: env.GOOGLE_SUCCESS_REDIRECT,
} as const;

export const jwt = {
  secret: env.JWT_SECRET,
  expiration: env.JWT_EXPIRATION ?? "1m",
} as const;

export const jwrt = {
  secret: env.JWRT_SECRET,
  expiration: env.JWRT_EXPIRATION ?? "7d",
} as const;

export const port = env.PORT;

export const rateLimitOptions = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
} as const;

const MONGO_URIS: { [index: string]: string } = {
  production: env.MONGODB_URI,
  development: env.MONGODB_URI_LOCAL,
  test: env.MONGODB_URI_TEST,
} as const;

export const mongo = {
  uri: MONGO_URIS[env.NODE_ENV ?? "development"],
} as const;
