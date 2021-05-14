import { setupMongoose, setupApolloServer } from "@utils/test";
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
        email
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

const definition = {
  word: "word",
  meaning: "meaning",
  example: "example",
  language: "fr",
};

setupMongoose();

describe("The ApolloServer", () => {
  it("should return an empty array", async () => {
    const { query } = await setupApolloServer();
    const { data, errors } = await query({ query: GET_DEFINITIONS });
    expect(errors).toBeUndefined();
    expect(data.definitions).toEqual([]);
  });

  it("should return a definition id", async () => {
    const { mutate } = await setupApolloServer();
    const { data, errors } = await mutate({ mutation: CREATE_DEFINITION, variables: definition });
    expect(errors).toBeUndefined();
    expect(data.createDefinition.id).not.toBeUndefined();
  });

  it("should return an array with a definition", async () => {
    const { query, mutate, user } = await setupApolloServer();
    const { id, email, name } = user;
    await mutate({ mutation: CREATE_DEFINITION, variables: definition });
    const { data, errors } = await query({ query: GET_DEFINITIONS });
    expect(errors).toBeUndefined();
    expect(data.definitions).toBeInstanceOf(Array);
    expect(data.definitions[0].author).toEqual({ id, email, name });
  });
});
