import { expectValidationErrors, mockedContext, mockedDefinition, setupMocks } from "@test";
import { ApolloError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";
import { DEFINITION, EXAMPLE, TRANSLATION, MEANING, WORD } from "./errors";
import * as mutations from "./resolvers/mutations";
import * as queries from "./resolvers/queries";
import { validate } from "./validation";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");

setupMocks();

describe("Definition", () => {
  const id = mockedDefinition.document._id.toHexString();

  const { get, list, count, popular, search, create, remove, review } = mockedContext.dataSources.definition;

  describe("queries", () => {
    describe("count", () => {
      it("should resolve", async () => {
        mocked(count).mockResolvedValue(0);
        const c = await queries.count(null, {}, mockedContext, null);
        expect(count).toBeCalledWith({});
        expect(c).toEqual(0);
      });

      it("should resolve with filters", async () => {
        mocked(count).mockResolvedValue(0);
        const filter = { author: "author", word: "word" };
        const c = await queries.count(null, { filter }, mockedContext, null);
        expect(count).toBeCalledWith({ filter });
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

      it("should throw if the definition is not found", async () => {
        mocked(get).mockResolvedValue(null);
        await expect(queries.definition(null, { id }, mockedContext, null)).rejects.toThrow(
          new ApolloError(DEFINITION.NOT_FOUND),
        );
        expect(get).toBeCalledWith(id, 30);
      });

      it("should not throw because the id is invalid", async () => {
        mocked(get).mockResolvedValue(null);
        await expect(queries.definition(null, { id: "invalid id" }, mockedContext, null)).rejects.toThrow(
          new ApolloError(DEFINITION.NOT_FOUND),
        );
        expect(get).toBeCalledWith("invalid id", 30);
      });
    });

    describe("definitions", () => {
      it("should resolve", async () => {
        mocked(list).mockResolvedValue([]);
        const definitions = await queries.definitions(null, {}, mockedContext, null);
        expect(list).toBeCalledWith({});
        expect(definitions).toEqual([]);
      });

      it("should not throw if the author id in the filter is invalid", async () => {
        mocked(get).mockResolvedValue(null);
        await expect(
          queries.definitions(null, { filter: { author: "invalid id" } }, mockedContext, null),
        ).resolves.not.toThrow();
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
        expect(create).toBeCalledWith(mockedDefinition.args);
        expect(definition).toEqual(mockedDefinition.document);
      });
    });

    describe("deleteDefinition", () => {
      it("should resolve", async () => {
        mocked(remove).mockResolvedValue(mockedDefinition.document);
        const definition = await mutations.deleteDefinition(null, { id }, mockedContext, null);
        expect(remove).toBeCalledWith(id);
        expect(definition).toEqual(mockedDefinition.document);
      });

      it("should throw if the definition is not found", async () => {
        mocked(remove).mockResolvedValue(null);
        await expect(mutations.deleteDefinition(null, { id }, mockedContext, null)).rejects.toThrow(
          new ApolloError(DEFINITION.NOT_FOUND),
        );
        expect(remove).toBeCalledWith(id);
      });

      it("should not throw because the id is invalid", async () => {
        mocked(get).mockResolvedValue(null);
        await expect(
          mutations.deleteDefinition(null, { id: "invalid id" }, mockedContext, null),
        ).rejects.toThrow(new ApolloError(DEFINITION.NOT_FOUND));
        expect(remove).toBeCalledWith("invalid id");
      });
    });

    describe("review", () => {
      it("should resolve", async () => {
        mocked(review).mockResolvedValue(mockedDefinition.document);
        const definition = await mutations.review(null, { id }, mockedContext, null);
        expect(review).toBeCalledWith(id);
        expect(definition).toEqual(mockedDefinition.document);
      });

      it("should not throw if the id is invalid", async () => {
        mocked(get).mockResolvedValue(null);
        await expect(
          mutations.review(null, { id: "invalid id" }, mockedContext, null),
        ).resolves.not.toThrow();
      });
    });
  });

  describe("validation", () => {
    it.each([
      ["word", { word: WORD.EMPTY }, { word: "" }],
      ["meaning", { meaning: MEANING.EMPTY }, { meaning: "" }],
    ])("should throw if the %s is empty", (_, validationErrors, args) =>
      expectValidationErrors(validationErrors, () => validate({ ...mockedDefinition.args, ...args })),
    );

    it.each([
      ["meaning", { meaning: MEANING.TOO_LONG }, { meaning: "#".repeat(303) }],
      ["example", { example: EXAMPLE.TOO_LONG }, { example: "#".repeat(103) }],
    ])("should throw if %s greater than their max", (_, validationErrors, args) =>
      expectValidationErrors(validationErrors, () => validate({ ...mockedDefinition.args, ...args })),
    );

    it("should throw if the translation is neither fr or gf", () =>
      expectValidationErrors({ translation: TRANSLATION.FR_GF }, () =>
        validate({ ...mockedDefinition.args, translation: "en" }),
      ));
  });
});
