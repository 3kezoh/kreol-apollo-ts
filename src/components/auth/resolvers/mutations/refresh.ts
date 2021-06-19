import { AsyncResolver, AuthResponse as R, jwrtDecoded } from "@@components";
import { USER } from "@Auth/errors";
import { jwrt } from "@config/globals";
import { AuthenticationError } from "apollo-server-express";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import ms from "ms";

export const refresh: AsyncResolver<undefined, R> = async (_, __, { dataSources, req, res }) => {
  try {
    const { refreshToken: candidateRefreshToken } = req.cookies;
    const { sub, jti, exp } = verify(candidateRefreshToken, jwrt.secret) as jwrtDecoded;
    const user = await dataSources.user.get(sub);
    if (!user) throw new AuthenticationError(USER.NOT_FOUND);
    const isBlacklisted = user.blacklist?.includes({ jti, exp });
    if (isBlacklisted) throw new Error("Log in");
    const { accessToken, refreshToken } = await user.token();
    res?.cookie("refreshToken", refreshToken, { maxAge: ms(jwrt.expiration), httpOnly: true });
    return { accessToken, user };
  } catch (error) {
    if (error instanceof JsonWebTokenError) throw new Error("Please log in");
    throw new Error(error);
  }
};
