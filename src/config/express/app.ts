import { apolloServer } from "@config/apollo";
import { cookieSession } from "@config/cookie";
import { rateLimitOptions } from "@config/env";
import "@config/passport";
import { google, logout } from "@middlewares/auth";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "errorhandler";
import express from "express";
import rateLimit from "express-rate-limit";
import passport from "passport";
import morgan from "morgan";

export const app = express();

const corsOptions: cors.CorsOptions = {
  origin: [
    "http://localhost:3000",
    "https://ekezoh-kreol-front-end.herokuapp.com",
    "https://studio.apollographql.com",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(rateLimit(rateLimitOptions));
app.use(compression());
app.use(morgan("tiny"));
app.use(cookieSession);
app.use(passport.initialize());
app.use(passport.session());
app.get("/auth/google", google.authenticate);
app.get("/auth/google/callback", google.callback);
app.get("/auth/logout", logout);
// app.use(errorHandler({ log: (err) => console.error(err) }));
app.use(errorHandler({ log: () => {} }));

const startApolloServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: corsOptions });
};

startApolloServer();
