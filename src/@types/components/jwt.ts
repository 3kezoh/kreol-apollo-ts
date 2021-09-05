import type { ObjectID } from "mongodb";

export type jwtPayload = { sub: ObjectID; name: string };
export type jwrtPayload = { sub: ObjectID };
export type jwrtDecoded = { sub: string; iat: number; exp: number; jti: string };
