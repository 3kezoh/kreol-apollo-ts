const compression = require("compression");
const cors = require("cors");
const errorHandler = require("errorhandler");
const express = require("express");
const rateLimit = require("express-rate-limit");
const apolloServer = require("../apollo/server");

const app = express();

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(cors());
app.use(compression());
apolloServer.applyMiddleware({ app });
app.use(errorHandler());

module.exports = app;
