import { QueryVerifyArgs, Resolver } from "@@components";
import { jwt as _jwt } from "@config/globals";
import jwt from "jsonwebtoken";

export const verify: Resolver<QueryVerifyArgs, boolean> = (_parent, { accessToken }) => {
  try {
    return !!jwt.verify(accessToken, _jwt.secret);
  } catch (error) {
    return false;
  }
};
