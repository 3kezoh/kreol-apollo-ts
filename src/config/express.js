const compression = require("compression");
const express = require("express");
const errorHandler = require("errorhandler");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const strategies = require("./strategies");
const { jwt, google } = require("../middlewares/auth");
const apolloServer = require("../apollo/server");
const { windowMs, max } = require("./globals");

const app = express();

app.use(rateLimit({ windowMs, max }));
app.use(compression());
app.use(passport.initialize());
passport.use(strategies.jwt);
passport.use(strategies.google);
app.get("/auth/google", google.authenticate);
app.get("/auth/google/callback", google.callback, google.success);
app.use("/graphql", jwt.authenticate);
app.use(errorHandler({ log: (err) => console.error(err) }));
apolloServer.applyMiddleware({ app });

module.exports = app;
