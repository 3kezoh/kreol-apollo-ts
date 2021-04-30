const cors = require("cors");
const compression = require("compression");
const express = require("express");
const errorHandler = require("errorhandler");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const { jwt, google } = require("@middlewares/auth");
const apolloServer = require("@@apollo/server");
const logger = require("@config/winston");
const strategies = require("@config/strategies");
const { windowMs, max } = require("@config/globals");

const app = express();

const whitelist = ["http://localhost:3000"];

const corsOptions = {
  origin: (origin, cb) => cb(null, whitelist.indexOf(origin) !== -1),
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(rateLimit({ windowMs, max }));
app.use(compression());
app.use(passport.initialize());
passport.use(strategies.jwt);
passport.use(strategies.google);
app.get("/auth/google", google.authenticate);
app.get("/auth/google/callback", google.callback, google.success);
app.use("/graphql", jwt.authenticate);
app.use(errorHandler({ log: (err) => logger.error(err) }));
apolloServer.applyMiddleware({ app });

module.exports = app;
