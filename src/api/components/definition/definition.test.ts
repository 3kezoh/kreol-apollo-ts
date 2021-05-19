import { DataSourcesContext } from "@@api";
import { Definition, DefinitionDataSource, definitionValidation } from "@Definition";
import { count, definition, definitions, popular, search } from "@Definition/resolvers/queries";
import { User, UserDataSource } from "@User";
import { mockedDefinition, mockedDefinitionDocument } from "@utils/test";
import { Vote, VoteDataSource } from "@Vote";
import { ApolloError, UserInputError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Definition", () => {
  const mockedContext: DataSourcesContext = {
    dataSources: {
      definition: new DefinitionDataSource(Definition),
      user: new UserDataSource(User),
      vote: new VoteDataSource(Vote),
    },
  };

  const id = mockedDefinitionDocument._id.toHexString();

  const {
    getDefinition,
    getDefinitions,
    getCount,
    getPopular,
    search: _search,
  } = mockedContext.dataSources.definition;

  describe("queries", () => {
    describe("count", () => {
      it("should resolve", async () => {
        mocked(getCount).mockResolvedValue(0);
        const c = await count(null, {}, mockedContext, null);
        expect(getCount).toBeCalledWith({});
        expect(c).toEqual(0);
      });
    });

    describe("definition", () => {
      it("should resolve", async () => {
        mocked(getDefinition).mockResolvedValue(mockedDefinitionDocument);
        const d = await definition(null, { id }, mockedContext, null);
        expect(getDefinition).toBeCalledWith(id);
        expect(d).toEqual(mockedDefinitionDocument);
      });

      it("should throw because the definition is not found", async () => {
        mocked(getDefinition).mockResolvedValue(null);
        await expect(definition(null, { id }, mockedContext, null)).rejects.toThrow(
          new ApolloError("Definition Not Found"),
        );
        expect(getDefinition).toBeCalledWith(id);
      });
    });

    describe("definitions", () => {
      it("should resolve", async () => {
        mocked(getDefinitions).mockResolvedValue([]);
        const d = await definitions(null, {}, mockedContext, null);
        expect(getDefinitions).toBeCalledWith({});
        expect(d).toEqual([]);
      });
    });

    describe("popular", () => {
      it("should resolve", async () => {
        mocked(getPopular).mockResolvedValue([]);
        const d = await popular(null, { letter: "w", limit: 3 }, mockedContext, null);
        expect(getPopular).toBeCalledWith({ letter: "w", limit: 3 });
        expect(d).toEqual([]);
      });
    });

    describe("search", () => {
      it("should resolve", async () => {
        mocked(_search).mockResolvedValue([]);
        const d = await search(null, { match: "" }, mockedContext, null);
        expect(_search).toBeCalledWith({ match: "" });
        expect(d).toEqual([]);
      });
    });
  });

  describe("validation", () => {
    it.each([["word", "meaning", "language"]])("should throw if %s is empty", (attr) => {
      (mockedDefinition as { [i: string]: string })[attr] = "";
      expect(() => definitionValidation(mockedDefinition)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "%s", message: "%s is empty" }],
        }),
      );
    });

    it.each(["meaning", "example"])("should throw if %s greater than 1500", (attr) => {
      (mockedDefinition as { [i: string]: string })[attr] = "#".repeat(1503);
      expect(() => definitionValidation(mockedDefinition)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "%s", message: "%s is too long" }],
        }),
      );
    });

    it("should throw if language is neither fr or gf", () => {
      mockedDefinition.language = "en";
      expect(() => definitionValidation(mockedDefinition)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "language", message: "language can only be fr or gf" }],
        }),
      );
    });
  });
});
