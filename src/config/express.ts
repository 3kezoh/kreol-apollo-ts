import cors from "cors";
import compression from "compression";
import express from "express";
import errorHandler from "errorhandler";
import rateLimit from "express-rate-limit";
import passport from "passport";
import { jwt, google } from "@middlewares/auth";
import { apolloServer } from "@@apollo";
import strategies from "@config/strategies";
import { rateLimit as rL } from "@config/globals";

const app = express();

const whitelist = ["http://localhost:3000, https://studio.apollographql.com"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, cb) => cb(null, whitelist.indexOf(origin ?? "") !== -1),
  optionsSuccessStatus: 200,
};

const { windowMs, max } = rL;

app.use(cors(corsOptions));
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

export default app;
