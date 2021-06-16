import { jwtSecret } from "@config/globals";
import { getUser, mockedDefinition, mockedUser, setupApolloServer, setupMongoose } from "@test";
import {
  CREATE_DEFINITION,
  GET_DEFINITIONS,
  LOGIN,
  REPORT,
  REVIEW_DEFINITION,
  SIGNUP,
  VOTE,
} from "@test/graphql";
import { verify } from "jsonwebtoken";

setupMongoose();

const createDefinition = async () => {
  const { user, admin } = await getUser();
  const _user = await setupApolloServer(user);
  const { data } = await _user.mutate({ mutation: CREATE_DEFINITION, variables: mockedDefinition.args });
  const _admin = await setupApolloServer(admin);
  await _admin.mutate({ mutation: REVIEW_DEFINITION, variables: { id: data.createDefinition.id } });
  const definition = data.createDefinition.id;
  return { user, admin, definition };
};

describe("The ApolloServer", () => {
  it("should return an empty array", async () => {
    const { user } = await getUser();
    const { query } = await setupApolloServer(user);
    const { data, errors } = await query({ query: GET_DEFINITIONS });
    expect(errors).toBeUndefined();
    expect(data.definitions).toEqual([]);
  });

  it("should return a definition id", async () => {
    const { user } = await getUser();
    const { mutate } = await setupApolloServer(user);
    const { data, errors } = await mutate({ mutation: CREATE_DEFINITION, variables: mockedDefinition.args });
    expect(errors).toBeUndefined();
    expect(data.createDefinition.id).not.toBeUndefined();
  });

  it("should return an array with a definition", async () => {
    const { user } = await createDefinition();
    const { query } = await setupApolloServer(user);
    const { data, errors } = await query({ query: GET_DEFINITIONS });
    expect(errors).toBeUndefined();
    expect(data.definitions).toBeInstanceOf(Array);
    expect(data.definitions).toHaveLength(1);
    expect(data.definitions[0].author).toEqual({ id: user.id, name: user.name });
  });

  it("should return a vote", async () => {
    const { definition, user } = await createDefinition();
    const { mutate } = await setupApolloServer(user);
    const { data, errors } = await mutate({ mutation: VOTE, variables: { definition, action: 1 } });
    expect(errors).toBeUndefined();
    expect(data.vote.voter).toEqual({ id: user.id, name: user.name });
    expect(data.vote.definition).toEqual({ ...mockedDefinition.args, id: definition });
    expect(data.vote.action).toEqual(1);
  });

  it("should return a report", async () => {
    const { definition, user } = await createDefinition();
    const { mutate } = await setupApolloServer(user);
    const { data, errors } = await mutate({ mutation: REPORT, variables: { definition, reason: 1 } });
    expect(errors).toBeUndefined();
    expect(data.report.reporter).toEqual({ id: user.id, name: user.name });
    expect(data.report.definition).toEqual({ ...mockedDefinition.args, id: definition });
    expect(data.report.reason).toEqual(1);
  });

  it("should return a token when signing up", async () => {
    const { mutate } = await setupApolloServer();
    const { data, errors } = await mutate({ mutation: SIGNUP, variables: mockedUser.args });
    expect(errors).toBeUndefined();
    expect(data.signup.user.name).toEqual(mockedUser.args.name);
    expect(() => verify(data.signup.token, jwtSecret)).not.toThrow();
  });

  it("should return a token when login in", async () => {
    const { mutate } = await setupApolloServer();
    await mutate({ mutation: SIGNUP, variables: mockedUser.args });
    const { data, errors } = await mutate({ mutation: LOGIN, variables: mockedUser.args });
    expect(errors).toBeUndefined();
    expect(data.login.user.name).toEqual(mockedUser.args.name);
    expect(() => verify(data.login.token, jwtSecret)).not.toThrow();
  });
});
