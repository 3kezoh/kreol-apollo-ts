import { jwrtPayload } from "@@components";
import { jwrt } from "@config/globals";
import { User, UserDataSource } from "@User";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { EMAIL, NAME, PASSWORD, USER } from "./errors";

const userDataSource = new UserDataSource(User);

export const signup = async ({ body }: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = body;
    let user = await userDataSource.getBy({ email });
    if (user) throw new Error(EMAIL.ALREADY_TAKEN);
    user = await userDataSource.getBy({ name });
    if (user) throw new Error(NAME.ALREADY_TAKEN);
    user = await userDataSource.create({ email, name, password });
    const token = await user.token();
    return res.status(StatusCodes.CREATED).json(token);
  } catch (error) {
    return next(error);
  }
};

export const login = async ({ body }: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = body;
    const user = await userDataSource.getBy({ email });
    if (!user) throw new Error(USER.NOT_FOUND);
    const passwordMatches = await user.passwordMatches(password);
    if (!passwordMatches) throw new Error(PASSWORD.INVALID);
    const token = await user.token();
    return res.json(token);
  } catch (error) {
    return next(error);
  }
};

export const refresh = async ({ body }: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = body;
    const { sub } = verify(refreshToken, jwrt.secret) as jwrtPayload;
    if (!sub) throw new Error();
    const user = await userDataSource.get(sub);
    if (!user) throw Error(USER.NOT_FOUND);
    const refreshTokenMatches = user.refreshTokenMatches(refreshToken);
    if (!refreshTokenMatches) throw new Error("Please log in.");
    const token = await user.token();
    return res.json(token);
  } catch (error) {
    return next(error);
  }
};
