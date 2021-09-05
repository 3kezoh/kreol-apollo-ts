declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
      JWT_EXPIRATION: string;
      JWRT_SECRET: string;
      JWRT_EXPIRATION: string;
      MONGODB_URI: string;
      MONGODB_URI_LOCAL: string;
      MONGODB_URI_TEST: string;
      PORT: number;
      NODE_ENV: "production" | "development" | "test";
      RATE_LIMIT_WINDOW_MS: number;
      RATE_LIMIT_MAX: number;
      COOKIE_NAME: string;
      COOKIE_KEY: string;
      COOKIE_MAX_AGE: number;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      GOOGLE_SUCCESS_REDIRECT: string;
    }
  }
}

export {};
