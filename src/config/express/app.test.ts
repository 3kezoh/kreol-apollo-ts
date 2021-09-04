/**
 * TODO passport-google-oauth2 test
 */

import { jwrt, jwt } from "@config/globals";
import { LOGIN, REFRESH, SIGNUP } from "@test/graphql";
import { mockedUser, setupMongoose } from "@utils/test";
import { parse } from "cookie";
import { DocumentNode, print } from "graphql";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import request from "supertest";
import { app } from "./app";

const agent = request.agent(app);

setupMongoose();

describe("Express app", () => {
  describe("GET /auth/logout", () => {
    it("should return expired authentication cookies", async () => {
      const { headers } = await agent.get("/auth/logout");
      const parsedCookies = (headers["set-cookie"] as string[]).map((cookie) => parse(cookie));
      parsedCookies.forEach((parsedCookie) => {
        expect(Date.parse(parsedCookie.expires)).toBeLessThan(Date.now());
      });
    });
  });

  /**
   * ! Google OAuth 2 for now
   */

  describe.skip("POST /graphql", () => {
    const mutate = (mutation: DocumentNode) =>
      agent.post("/graphql").send({ query: print(mutation), variables: mockedUser.args });

    const expectToken = ({ accessToken }: any, headers: any) => {
      const { refreshToken } = parse(headers["set-cookie"][0]);
      expect(() => verify(refreshToken, jwrt.secret)).not.toThrow();
      expect(() => verify(accessToken, jwt.secret)).not.toThrow();
    };

    describe("signup", () => {
      it("should resolve", async () => {
        const { headers, body } = await mutate(SIGNUP).expect(StatusCodes.OK);
        expectToken(body.data.signup, headers);
      });
    });

    describe("login", () => {
      it("should resolve", async () => {
        await mutate(SIGNUP);
        const { headers, body } = await mutate(LOGIN).expect(StatusCodes.OK);
        expectToken(body.data.login, headers);
      });
    });

    describe("refresh", () => {
      it("should resolve", async () => {
        await mutate(SIGNUP);
        const { headers, body } = await mutate(REFRESH).expect(StatusCodes.OK);
        expectToken(body.data.refresh, headers);
      });
    });
  });
});
