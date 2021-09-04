/**
 * ? Refactoring tests
 */

import { IUserDocument } from "@components/user";
import { jwt } from "@config/globals";
import { getAdmin, getUser, mockedDefinition, mockedUser, setupApolloServer, setupMongoose } from "@test";
import {
  COUNT,
  CREATE_DEFINITION,
  GET_DEFINITIONS,
  LOGIN,
  REPORT,
  REVIEW_DEFINITION,
  SIGNUP,
  VOTE,
  GET_POPULAR,
} from "@test/graphql";
import { verify } from "jsonwebtoken";

setupMongoose();

/**
 * @returns the definition id
 */

const createDefinition = async (author: IUserDocument) => {
  const { mutate } = setupApolloServer(author);
  const { data } = await mutate({ mutation: CREATE_DEFINITION, variables: mockedDefinition.args });
  const admin = await getAdmin();
  const apolloServerAdmin = setupApolloServer(admin);
  await apolloServerAdmin.mutate({
    mutation: REVIEW_DEFINITION,
    variables: { id: data.createDefinition.id },
  });
  return data.createDefinition.id;
};

describe("Apollo Server", () => {
  describe("Definition", () => {
    describe("queries", () => {
      describe("count", () => {
        it("should return 0", async () => {
          const user = await getUser();
          const { query } = setupApolloServer(user);
          const { data, errors } = await query({ query: COUNT });
          expect(errors).toBeUndefined();
          expect(data.count).toEqual(0);
        });

        it("should return 1", async () => {
          const user = await getUser();
          await createDefinition(user);
          const { query } = setupApolloServer(user);
          const { data, errors } = await query({ query: COUNT });
          expect(errors).toBeUndefined();
          expect(data.count).toEqual(1);
        });

        it("should return 1 with filters", async () => {
          const user = await getUser();
          await createDefinition(user);
          const { query } = setupApolloServer(user);
          const variables = { author: user.id, word: "word" };
          const { data, errors } = await query({ query: COUNT, variables });
          expect(errors).toBeUndefined();
          expect(data.count).toEqual(1);
        });

        it("should return 0 if the id is invalid", async () => {
          const user = await getUser();
          await createDefinition(user);
          const { query } = setupApolloServer(user);
          const variables = { author: "invalid id" };
          const { data, errors } = await query({ query: COUNT, variables });
          expect(errors).toBeUndefined();
          expect(data.count).toEqual(0);
        });
      });

      describe("definitions", () => {
        it("should return an empty array", async () => {
          const user = await getUser();
          const { query } = setupApolloServer(user);
          const { data, errors } = await query({ query: GET_DEFINITIONS });
          expect(errors).toBeUndefined();
          expect(data.definitions).toEqual([]);
        });

        it("should return an array with a definition", async () => {
          const user = await getUser();
          await createDefinition(user);
          const { query } = setupApolloServer(user);
          const { data, errors } = await query({ query: GET_DEFINITIONS });
          expect(errors).toBeUndefined();
          expect(data.definitions).toBeInstanceOf(Array);
          expect(data.definitions).toHaveLength(1);
          expect(data.definitions[0].author).toEqual({ id: user.id, name: user.name });
        });
      });

      describe("popular", () => {
        it("should return an empty array", async () => {
          const user = await getUser();
          const { query } = setupApolloServer(user);
          const { data, errors } = await query({ query: GET_POPULAR });
          expect(errors).toBeUndefined();
          expect(data.popular).toEqual([]);
        });
      });
    });

    describe("mutations", () => {
      describe("create", () => {
        it("should return a definition id", async () => {
          const user = await getUser();
          await createDefinition(user);
          const { mutate } = setupApolloServer(user);
          const { data, errors } = await mutate({
            mutation: CREATE_DEFINITION,
            variables: mockedDefinition.args,
          });
          expect(errors).toBeUndefined();
          expect(data.createDefinition.id).not.toBeUndefined();
        });
      });
    });
  });

  it("should return a vote", async () => {
    const user = await getUser();
    const definition = await createDefinition(user);
    const { mutate } = setupApolloServer(user);
    const { data, errors } = await mutate({ mutation: VOTE, variables: { definition, action: 1 } });
    expect(errors).toBeUndefined();
    expect(data.vote.voter).toEqual({ id: user.id, name: user.name });
    expect(data.vote.definition).toEqual({ ...mockedDefinition.args, id: definition });
    expect(data.vote.action).toEqual(1);
  });

  it("should return a report", async () => {
    const user = await getUser();
    const definition = await createDefinition(user);
    const { mutate } = setupApolloServer(user);
    const { data, errors } = await mutate({ mutation: REPORT, variables: { definition, reason: 1 } });
    expect(errors).toBeUndefined();
    expect(data.report.reporter).toEqual({ id: user.id, name: user.name });
    expect(data.report.definition).toEqual({ ...mockedDefinition.args, id: definition });
    expect(data.report.reason).toEqual(1);
  });

  /**
   * * Google OAuth2 only for now
   */

  it.skip("should return an accessToken when signing up", async () => {
    const { mutate } = setupApolloServer();
    const { data, errors } = await mutate({ mutation: SIGNUP, variables: mockedUser.args });
    expect(errors).toBeUndefined();
    expect(data.signup.user.name).toEqual(mockedUser.args.name);
    expect(() => verify(data.signup.accessToken, jwt.secret)).not.toThrow();
  });

  it.skip("should return an accessToken when login in", async () => {
    const { mutate } = setupApolloServer();
    await mutate({ mutation: SIGNUP, variables: mockedUser.args });
    const { data, errors } = await mutate({ mutation: LOGIN, variables: mockedUser.args });
    expect(errors).toBeUndefined();
    expect(data.login.user.name).toEqual(mockedUser.args.name);
    expect(() => verify(data.login.accessToken, jwt.secret)).not.toThrow();
  });
});
