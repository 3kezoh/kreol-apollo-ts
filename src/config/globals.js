const dotenv = require("dotenv");
const fs = require("fs");

if (fs.existsSync(".env")) {
  dotenv.config({ path: ".env" });
  console.info("Using .env file to supply environment variables");
} else if (fs.existsSync(".env.example")) {
  dotenv.config({ path: ".env.example" });
  console.info("Using .env.example file to supply environment variables");
} else {
  console.error(".env or .env.example missing");
}

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: parseInt(process.env.JWT_EXPIRATION, 10),
  mongo: {
    uri:
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI
        : process.env.MONGODB_URI_LOCAL,
  },
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.RATE_LIMIT_MAX, 10),
};
