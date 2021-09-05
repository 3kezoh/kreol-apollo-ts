/**
 * ! apollo-server-testing deprecated, use executeOperation
 * ? Refactoring tests
 */

import type { IUserDocument } from "@components/user";
import { jwt } from "@config/env";
import { getAdmin, getUser, mockedDefinition, mockedUser, setupApolloServer, setupMongoose } from "@test";
import { REPORT, USER, USERS, VOTE } from "@test/graphql";
import { LOGIN, ME, SIGNUP, VERIFY } from "@test/graphql/auth";
import {
  COUNT,
  CREATE_DEFINITION,
  GET_DEFINITIONS,
  GET_POPULAR,
  REVIEW_DEFINITION,
} from "@test/graphql/definition";
import type { DocumentNode } from "graphql";
import { verify } from "jsonwebtoken";

setupMongoose();

let user: IUserDocument;

beforeEach(async () => {
  user = await getUser();
});

type executeOperationArgs = {
  query: DocumentNode;
  variables?: { [name: string]: any };
  user?: IUserDocument;
};

const executeOperation = async ({ query, variables, user }: executeOperationArgs) => {
  const apolloServer = setupApolloServer(user);
  return apolloServer.executeOperation({ query, variables });
};

/**
 * @returns the definition id
 */

const createDefinition = async () => {
  const { data } = await executeOperation({
    query: CREATE_DEFINITION,
    variables: mockedDefinition.args,
    user,
  });
  const admin = await getAdmin();
  await executeOperation({
    query: REVIEW_DEFINITION,
    variables: { id: data?.createDefinition.id },
    user: admin,
  });
  return data?.createDefinition.id;
};

describe("Apollo Server", () => {
  describe("Definition", () => {
    describe("queries", () => {
      describe("count", () => {
        it("should return 0", async () => {
          const { data, errors } = await executeOperation({ query: COUNT });
          expect(errors).toBeUndefined();
          expect(data?.count).toEqual(0);
        });

        it("should return 1", async () => {
          await createDefinition();
          const { data, errors } = await executeOperation({ query: COUNT });
          expect(errors).toBeUndefined();
          expect(data?.count).toEqual(1);
        });

        it("should return 1 with filters", async () => {
          await createDefinition();
          const variables = { author: user.id, word: "word" };
          const { data, errors } = await executeOperation({ query: COUNT, variables });
          expect(errors).toBeUndefined();
          expect(data?.count).toEqual(1);
        });

        it("should return 0 if the id is invalid", async () => {
          await createDefinition();
          const variables = { author: "invalid id" };
          const { data, errors } = await executeOperation({ query: COUNT, variables });
          expect(errors).toBeUndefined();
          expect(data?.count).toEqual(0);
        });
      });

      describe("definitions", () => {
        it("should return an empty array", async () => {
          const { data, errors } = await executeOperation({ query: GET_DEFINITIONS });
          expect(errors).toBeUndefined();
          expect(data?.definitions).toEqual([]);
        });

        it("should return an array with a definition", async () => {
          await createDefinition();
          const { data, errors } = await executeOperation({ query: GET_DEFINITIONS });
          expect(errors).toBeUndefined();
          expect(data?.definitions).toBeInstanceOf(Array);
          expect(data?.definitions).toHaveLength(1);
          expect(data?.definitions[0].author).toEqual({ id: user.id, name: user.name });
        });
      });

      describe("popular", () => {
        it("should return an empty array", async () => {
          const { data, errors } = await executeOperation({ query: GET_POPULAR });
          expect(errors).toBeUndefined();
          expect(data?.popular).toEqual([]);
        });
      });

      describe("search", () => {
        it("should return an empty array", async () => {
          const { data, errors } = await executeOperation({ query: GET_POPULAR });
          expect(errors).toBeUndefined();
          expect(data?.popular).toEqual([]);
        });
      });
    });

    describe("mutations", () => {
      describe("create", () => {
        it("should return a definition id", async () => {
          const { data, errors } = await executeOperation({
            query: CREATE_DEFINITION,
            variables: mockedDefinition.args,
            user,
          });
          expect(errors).toBeUndefined();
          expect(data?.createDefinition.id).not.toBeUndefined();
        });
      });
    });
  });

  describe("Auth", () => {
    describe("queries", () => {
      describe("me", () => {
        it("should return null", async () => {
          const { data, errors } = await executeOperation({ query: ME });
          expect(errors).toBeUndefined();
          expect(data?.me).toBe(null);
        });

        it("should return the user info", async () => {
          const { data, errors } = await executeOperation({ query: ME, user });
          expect(errors).toBeUndefined();
          expect(data?.me).toEqual({ id: user.id, name: user.name });
        });
      });

      describe("verify", () => {
        it("should return false", async () => {
          const { data, errors } = await executeOperation({ query: VERIFY });
          expect(errors).toBeUndefined();
          expect(data?.verify).toBe(false);
        });

        it("should return true", async () => {
          const { data, errors } = await executeOperation({ query: VERIFY, user });
          expect(errors).toBeUndefined();
          expect(data?.verify).toBe(true);
        });
      });
    });
  });

  describe("User", () => {
    describe("queries", () => {
      describe("user", () => {
        it("should return a user", async () => {
          const { data, errors } = await executeOperation({ query: USER, variables: { id: user.id } });
          expect(errors).toBeUndefined();
          expect(data?.user).toEqual({ id: user.id, name: user.name });
        });
      });

      describe("users", () => {
        it("should return an array of users", async () => {
          const { data, errors } = await executeOperation({ query: USERS });
          expect(errors).toBeUndefined();
          expect(data?.users).toBeInstanceOf(Array);
          expect(data?.users).toHaveLength(1);
          expect(data?.users[0]).toEqual({ id: user.id, name: user.name });
        });
      });
    });
  });

  describe("Vote", () => {
    describe("mutations", () => {
      describe("vote", () => {
        it("should return a vote", async () => {
          const definition = await createDefinition();
          const { data, errors } = await executeOperation({
            query: VOTE,
            variables: { definition, action: 1 },
            user,
          });
          expect(errors).toBeUndefined();
          expect(data?.vote.voter).toEqual({ id: user.id, name: user.name });
          expect(data?.vote.definition).toEqual({ ...mockedDefinition.args, id: definition });
          expect(data?.vote.action).toEqual(1);
        });
      });
    });
  });

  describe("Report", () => {
    it("should return a report", async () => {
      const definition = await createDefinition();
      const { data, errors } = await executeOperation({
        query: REPORT,
        variables: { definition, reason: 1 },
        user,
      });
      expect(errors).toBeUndefined();
      expect(data?.report.reporter).toEqual({ id: user.id, name: user.name });
      expect(data?.report.definition).toEqual({ ...mockedDefinition.args, id: definition });
      expect(data?.report.reason).toEqual(1);
    });
  });

  /**
   * ! Google OAuth2 for now
   */

  it.skip("should return an accessToken when signing up", async () => {
    const { data, errors } = await executeOperation({ query: SIGNUP, variables: mockedUser.args });
    expect(errors).toBeUndefined();
    expect(data?.signup.user.name).toEqual(mockedUser.args.name);
    expect(() => verify(data?.signup.accessToken, jwt.secret)).not.toThrow();
  });

  it.skip("should return an accessToken when login in", async () => {
    await executeOperation({ query: SIGNUP, variables: mockedUser.args });
    const { data, errors } = await executeOperation({ query: LOGIN, variables: mockedUser.args });
    expect(errors).toBeUndefined();
    expect(data?.login.user.name).toEqual(mockedUser.args.name);
    expect(() => verify(data?.login.accessToken, jwt.secret)).not.toThrow();
  });
});
