import { QueryVerifyArgs, Resolver } from "@@api";
import { jwtSecret } from "@config/globals";
import jwt from "jsonwebtoken";

export const verify: Resolver<QueryVerifyArgs, boolean> = (_parent, { token }) => {
  try {
    return !!jwt.verify(token, jwtSecret);
  } catch (error) {
    return false;
  }
};
