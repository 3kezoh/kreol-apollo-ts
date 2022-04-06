import { cookie } from "@config/env";
import _cookieSession from "cookie-session";

const { key, maxAge, name } = cookie;

export const cookieSession = _cookieSession({ keys: [key], maxAge, name });
