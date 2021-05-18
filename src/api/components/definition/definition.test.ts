import { DataSourcesContext } from "@@api";
import { Definition, DefinitionDataSource, definitionValidation } from "@Definition";
import { count, definition, definitions, popular, search } from "@Definition/resolvers/queries";
import { User, UserDataSource } from "@User";
import { mockedDefinition, mockedUser } from "@utils/test";
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
    },
  };

  const id = mockedDefinition._id.toHexString();
  const author = mockedUser._id.toHexString();

  const {
    getDefinition,
    getDefinitions,
    getCount,
    getPopular,
    search: _search,
  } = mockedContext.dataSources.definition;

  const { getUser } = mockedContext.dataSources.user;

  describe("queries", () => {
    describe("count", () => {
      it("should resolve", async () => {
        mocked(getCount).mockResolvedValue(0);
        const c = await count(null, {}, mockedContext, null);
        expect(getCount).toBeCalledWith({});
        expect(c).toEqual(0);
      });

      it("should throw if author is not found", async () => {
        mocked(getUser).mockResolvedValue(null);
        await expect(count(null, { filter: { author } }, mockedContext, null)).rejects.toThrow(
          new ApolloError("User Not Found"),
        );
        expect(getCount).not.toBeCalled();
      });
    });

    describe("definition", () => {
      it("should resolve", async () => {
        mocked(getDefinition).mockResolvedValue(mockedDefinition);
        const d = await definition(null, { id }, mockedContext, null);
        expect(getDefinition).toBeCalledWith(id);
        expect(d).toEqual(mockedDefinition);
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
        expect(getDefinitions).toBeCalledWith({}, 1, 5);
        expect(d).toEqual([]);
      });
    });

    describe("popular", () => {
      it("should resolve", async () => {
        mocked(getPopular).mockResolvedValue([]);
        const d = await popular(null, { letter: "w" }, mockedContext, null);
        expect(getPopular).toBeCalledWith("w", 50);
        expect(d).toEqual([]);
      });
    });

    describe("search", () => {
      it("should resolve", async () => {
        mocked(_search).mockResolvedValue([]);
        const d = await search(null, { match: "" }, mockedContext, null);
        expect(_search).toBeCalledWith("", 1, 5);
        expect(d).toEqual([]);
      });
    });
  });

  describe("validation", () => {
    it("should throw if author has an invalid ObjectId", () => {
      expect(() => definitionValidation({ filter: { author: "3" } })).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "author", message: "Author Id is invalid" }],
        }),
      );
    });

    it("should throw if letter is invalid", () => {
      expect(() => definitionValidation({ letter: "3" })).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "letter", message: "Letter is invalid" }],
        }),
      );
    });

    it("should throw if page is negative", () => {
      expect(() => definitionValidation({ page: -3 })).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "page", message: "Page cannot be negative" }],
        }),
      );
    });

    it("should throw if limit is greater than 100", () => {
      expect(() => definitionValidation({ limit: 103 })).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "limit", message: "Limit cannot exceed 100" }],
        }),
      );
    });
  });
});
