import { setupMongoose, mockedUser, mockedDefinition } from "@utils/test";
import { definitions, definition, count, popular, search } from "@Definition/resolvers/queries";
import { Definition } from "@Definition";
import { ObjectId } from "mongodb";
import { mocked } from "ts-jest/utils";

jest.mock("./Definition", () => {
  return {
    aggregate: jest.fn().mockReturnThis(),
    append: jest.fn((d) => d),
    exec: jest.fn(),
    populate: jest.fn((d) => d),
    findById: jest.fn(),
  };
});

setupMongoose();

describe("Definition", () => {
  describe("queries", () => {
    describe("definitions", () => {
      it("should return an empty array", async () => {
        mocked(Definition.aggregate().exec).mockReturnValue([]);
        const d = await definitions(null, {}, {}, null);
        expect(Definition.aggregate).toBeCalledWith([
          { $match: {} },
          { $sort: { createdAt: -1 } },
          { $skip: 0 },
          { $limit: 5 },
          { $set: { id: "$_id" } },
        ]);
        expect(d).toEqual([]);
      });

      it("should return an array of definitions", async () => {
        mocked(Definition.aggregate().exec).mockReturnValue([mockedDefinition]);
        const [d] = await definitions(null, {}, { user: mockedUser }, null);
        expect(d).toEqual(mockedDefinition);
      });
    });
    describe("definition", () => {
      it("should return null", async () => {
        const d = await definition(null, { id: new ObjectId().toHexString() }, {}, null);
        expect(d).toBeNull();
      });

      it("should return null", async () => {
        const d = await definition(null, { id: mockedDefinition._id }, {}, null);
        expect(d).toEqual(mockedDefinition);
      });
    });
  });
});
