const compression = require("compression");
const express = require("express");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const strategies = require("./passport");
const { authenticate } = require("../middlewares/auth");
const apolloServer = require("../apollo/server");
const { windowMs, max } = require("./globals");

const app = express();

app.use(rateLimit({ windowMs, max }));
app.use(compression());
app.use(passport.initialize());
passport.use("jwt", strategies.jwt);
app.use("/graphql", authenticate);
apolloServer.applyMiddleware({ app });

module.exports = app;
