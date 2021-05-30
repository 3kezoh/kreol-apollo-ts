import jwt from "jsonwebtoken";
import { jwtSecret } from "@config/globals";
import { QueryVerifyArgs, Resolver } from "@@api";

const verify: Resolver<QueryVerifyArgs, boolean> = (_parent, { token }) => {
  try {
    return !!jwt.verify(token, jwtSecret);
  } catch (error) {
    return false;
  }
};

export default verify;
