import { definitionValidation } from "@Definition";
import mutations from "@Definition/resolvers/mutations";
import queries from "@Definition/resolvers/queries";
import { mockedContext, mockedDefinition, setupMocks } from "@test";
import { ApolloError, UserInputError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");

setupMocks();

describe("Definition", () => {
  const id = mockedDefinition.document._id.toHexString();

  const { get, list, count, popular, search, create, remove } = mockedContext.dataSources.definition;

  describe("queries", () => {
    describe("count", () => {
      it("should resolve", async () => {
        mocked(count).mockResolvedValue(0);
        const c = await queries.count(null, {}, mockedContext, null);
        expect(count).toBeCalledWith({});
        expect(c).toEqual(0);
      });
    });

    describe("definition", () => {
      it("should resolve", async () => {
        mocked(get).mockResolvedValue(mockedDefinition.document);
        const definition = await queries.definition(null, { id }, mockedContext, null);
        expect(get).toBeCalledWith(id, 30);
        expect(definition).toEqual(mockedDefinition.document);
      });

      it("should throw because the definition is not found", async () => {
        mocked(get).mockResolvedValue(null);
        await expect(queries.definition(null, { id }, mockedContext, null)).rejects.toThrow(
          new ApolloError("Definition Not Found"),
        );
        expect(get).toBeCalledWith(id, 30);
      });
    });

    describe("definitions", () => {
      it("should resolve", async () => {
        mocked(list).mockResolvedValue([]);
        const definitions = await queries.definitions(null, {}, mockedContext, null);
        expect(list).toBeCalledWith({});
        expect(definitions).toEqual([]);
      });
    });

    describe("popular", () => {
      it("should resolve", async () => {
        mocked(popular).mockResolvedValue([]);
        const definition = await queries.popular(null, { letter: "w", limit: 3 }, mockedContext, null);
        expect(popular).toBeCalledWith({ letter: "w", limit: 3 });
        expect(definition).toEqual([]);
      });
    });

    describe("search", () => {
      it("should resolve", async () => {
        mocked(search).mockResolvedValue([]);
        const definitions = await queries.search(null, { match: "" }, mockedContext, null);
        expect(search).toBeCalledWith({ match: "" });
        expect(definitions).toEqual([]);
      });
    });
  });

  describe("mutations", () => {
    describe("createDefinition", () => {
      it("should resolve", async () => {
        mocked(create).mockResolvedValue(mockedDefinition.document);
        const definition = await mutations.createDefinition(null, mockedDefinition.args, mockedContext, null);
        expect(create).toBeCalledWith(mockedDefinition.args, mockedContext.user);
        expect(definition).toEqual(mockedDefinition.document);
      });
    });

    describe("deleteDefinition", () => {
      it("should resolve", async () => {
        mocked(remove).mockResolvedValue(mockedDefinition.document);
        const definition = await mutations.deleteDefinition(null, { id }, mockedContext, null);
        expect(remove).toBeCalledWith(id, mockedContext.user?._id);
        expect(definition).toEqual(mockedDefinition.document);
      });

      it("should throw is definition is null", async () => {
        mocked(remove).mockResolvedValue(null);
        await expect(mutations.deleteDefinition(null, { id }, mockedContext, null)).rejects.toThrow(
          new ApolloError("Definition Not Found"),
        );
        expect(remove).toBeCalledWith(id, mockedContext.user?._id);
      });
    });
  });

  describe("validation", () => {
    it.each([["word", "meaning", "language"]])("should throw if %s is empty", (attr) => {
      (mockedDefinition.args as { [i: string]: string })[attr] = "";
      expect(() => definitionValidation(mockedDefinition.args)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "%s", message: "%s is empty" }],
        }),
      );
    });

    it.each(["meaning", "example"])("should throw if %s greater than 1500", (attr) => {
      (mockedDefinition.args as { [i: string]: string })[attr] = "#".repeat(1503);
      expect(() => definitionValidation(mockedDefinition.args)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "%s", message: "%s is too long" }],
        }),
      );
    });

    it("should throw if language is neither fr or gf", () => {
      mockedDefinition.args.language = "en";
      expect(() => definitionValidation(mockedDefinition.args)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "language", message: "language can only be fr or gf" }],
        }),
      );
    });
  });
});
