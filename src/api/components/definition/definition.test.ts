import { Context, DataSourcesContext } from "@@api";
import { Definition, DefinitionDataSource, definitionValidation } from "@Definition";
import { createDefinition, deleteDefinition } from "@Definition/resolvers/mutations";
import { count, definition, definitions, popular, search } from "@Definition/resolvers/queries";
import { User, UserDataSource } from "@User";
import { mockedDefinition, mockedDefinitionDocument, mockedUser } from "@utils/test";
import { Vote, VoteDataSource } from "@Vote";
import { ApolloError, UserInputError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Definition", () => {
  const mockedContext: Context & DataSourcesContext = {
    dataSources: {
      definition: new DefinitionDataSource(Definition),
      user: new UserDataSource(User),
      vote: new VoteDataSource(Vote),
    },
    user: mockedUser,
  };

  const id = mockedDefinitionDocument._id.toHexString();

  const {
    get,
    list,
    count: _count,
    popular: _popular,
    search: _search,
    create,
    remove,
  } = mockedContext.dataSources.definition;

  describe("queries", () => {
    describe("count", () => {
      it("should resolve", async () => {
        mocked(_count).mockResolvedValue(0);
        const c = await count(null, {}, mockedContext, null);
        expect(_count).toBeCalledWith({});
        expect(c).toEqual(0);
      });
    });

    describe("definition", () => {
      it("should resolve", async () => {
        mocked(get).mockResolvedValue(mockedDefinitionDocument);
        const d = await definition(null, { id }, mockedContext, null);
        expect(get).toBeCalledWith(id);
        expect(d).toEqual(mockedDefinitionDocument);
      });

      it("should throw because the definition is not found", async () => {
        mocked(get).mockResolvedValue(null);
        await expect(definition(null, { id }, mockedContext, null)).rejects.toThrow(
          new ApolloError("Definition Not Found"),
        );
        expect(get).toBeCalledWith(id);
      });
    });

    describe("definitions", () => {
      it("should resolve", async () => {
        mocked(list).mockResolvedValue([]);
        const d = await definitions(null, {}, mockedContext, null);
        expect(list).toBeCalledWith({});
        expect(d).toEqual([]);
      });
    });

    describe("popular", () => {
      it("should resolve", async () => {
        mocked(_popular).mockResolvedValue([]);
        const d = await popular(null, { letter: "w", limit: 3 }, mockedContext, null);
        expect(_popular).toBeCalledWith({ letter: "w", limit: 3 });
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

  describe("mutations", () => {
    describe("createDefinition", () => {
      it("should resolve", async () => {
        mocked(create).mockResolvedValue(mockedDefinitionDocument);
        const d = await createDefinition(null, mockedDefinition, mockedContext, null);
        expect(create).toBeCalledWith(mockedDefinition, mockedUser);
        expect(d).toEqual(mockedDefinitionDocument);
      });
    });

    describe("deleteDefinition", () => {
      it("should resolve", async () => {
        mocked(remove).mockResolvedValue(mockedDefinitionDocument);
        const d = await deleteDefinition(null, { id }, mockedContext, null);
        expect(remove).toBeCalledWith(id, mockedUser._id);
        expect(d).toEqual(mockedDefinitionDocument);
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
