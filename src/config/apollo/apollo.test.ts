import { setupMongoose, setupApolloServer, getUser } from "@test";
import { gql } from "apollo-server-express";

const GET_DEFINITIONS = gql`
  query GetDefinitions {
    definitions {
      id
      word
      meaning
      example
      language
      score
      action
      createdAt
      author {
        id
        name
      }
    }
  }
`;

const CREATE_DEFINITION = gql`
  mutation CreateDefinition($word: String!, $meaning: String!, $example: String, $language: String!) {
    createDefinition(word: $word, meaning: $meaning, example: $example, language: $language) {
      id
    }
  }
`;

const REVIEW_DEFINITION = gql`
  mutation ReviewDefinition($id: ID!) {
    review(id: $id) {
      id
    }
  }
`;

const definition = {
  word: "word",
  meaning: "meaning",
  example: "example",
  language: "fr",
};

setupMongoose();

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
    const { data, errors } = await mutate({ mutation: CREATE_DEFINITION, variables: definition });
    expect(errors).toBeUndefined();
    expect(data.createDefinition.id).not.toBeUndefined();
  });

  it("should return an array with a definition", async () => {
    const { user, admin } = await getUser();
    const _user = await setupApolloServer(user);
    const { data } = await _user.mutate({ mutation: CREATE_DEFINITION, variables: definition });
    let response = await _user.query({ query: GET_DEFINITIONS });
    expect(response.errors).toBeUndefined();
    expect(response.data.definitions).toEqual([]);
    const _admin = await setupApolloServer(admin);
    await _admin.mutate({
      mutation: REVIEW_DEFINITION,
      variables: { id: data.createDefinition.id },
    });
    response = await _user.query({ query: GET_DEFINITIONS });
    expect(response.data.definitions).toBeInstanceOf(Array);
    expect(response.data.definitions).toHaveLength(1);
    expect(response.data.definitions[0].author).toEqual({ id: user.id, name: user.name });
  });
});
