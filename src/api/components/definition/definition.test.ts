import { mockedDefinition } from "@utils/test";
import { definitions, definition, count, popular, search } from "@Definition/resolvers/queries";
import { Definition, DefinitionDataSource } from "@Definition";
import { mocked } from "ts-jest/utils";
import { DataSourceContext } from "@@api";

jest.mock("@Definition/DefinitionDataSource");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Definition", () => {
  const mockedContext: DataSourceContext = {
    dataSources: {
      definition: new DefinitionDataSource(Definition),
    },
  };

  const id = mockedDefinition._id.toHexString();

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

      it("should throw if author is not a valid ObjectId", async () => {
        await expect(count(null, { filter: { author: "1" } }, mockedContext, null)).rejects.toThrow();
        expect(getCount).not.toBeCalled();
      });

      it("should throw if author is not found", async () => {
        await expect(count(null, { filter: { author: "1" } }, mockedContext, null)).rejects.toThrow();
        expect(getCount).not.toBeCalled();
        fail();
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
        await expect(definition(null, { id }, mockedContext, null)).rejects.toThrow();
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
});
