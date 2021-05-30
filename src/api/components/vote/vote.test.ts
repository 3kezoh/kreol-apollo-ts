import { mockedContext, mockedDefinition, mockedVote, setupMocks } from "@test";
import { voteValidation } from "@Vote";
import mutations from "@Vote/resolvers/mutations";
import queries from "@Vote/resolvers/queries";
import { ApolloError, UserInputError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");
jest.mock("@Vote/VoteDataSource");

setupMocks();

describe("Vote", () => {
  const definition = mockedDefinition.document._id.toHexString();
  const definitionId = mockedDefinition.document._id;

  const { get, remove, upsert } = mockedContext.dataSources.vote;
  const { get: _get } = mockedContext.dataSources.definition;

  describe("queries", () => {
    describe("vote", () => {
      it("should resolve", async () => {
        mocked(get).mockResolvedValue(null);
        const vote = await queries.vote(null, { definition }, mockedContext, null);
        expect(get).toBeCalledWith(definition, mockedContext.user?._id);
        expect(vote).toEqual(null);
      });
    });
  });

  describe("mutations", () => {
    describe("vote", () => {
      it.each([
        [mockedVote(-1), { definition, action: -1 }],
        [mockedVote(1), { definition, action: 1 }],
      ])("should resolve when action is -1 or 1", async (voteDocument, { definition, action }) => {
        mocked(_get).mockResolvedValue(mockedDefinition.document);
        mocked(get).mockResolvedValue(null);
        mocked(upsert).mockResolvedValue(voteDocument);
        const vote = await mutations.vote(null, { definition, action }, mockedContext, null);
        expect(_get).toBeCalledWith(definition);
        expect(get).toBeCalledWith(definitionId, mockedContext.user?._id);
        expect(upsert).toBeCalledWith(definitionId, mockedContext.user?._id, action);
        expect(vote).toEqual(voteDocument);
      });

      it("should resolve if the action is 0", async () => {
        const voteDocument = mockedVote(1);
        mocked(_get).mockResolvedValue(mockedDefinition.document);
        mocked(get).mockResolvedValue(voteDocument);
        mocked(remove).mockResolvedValue(voteDocument);
        const vote = await mutations.vote(null, { definition, action: 0 }, mockedContext, null);
        expect(_get).toBeCalledWith(definition);
        expect(get).toBeCalledWith(definitionId, mockedContext.user?._id);
        expect(remove).toBeCalledWith(definitionId, mockedContext.user?._id);
        expect(vote).toEqual(voteDocument);
      });

      it("should throw if the definition is not found", async () => {
        mocked(_get).mockResolvedValue(null);
        await expect(mutations.vote(null, { definition, action: 0 }, mockedContext, null)).rejects.toThrow(
          new ApolloError("Definition Not Found"),
        );
        expect(get).not.toBeCalled();
        expect(remove).not.toBeCalled();
        expect(upsert).not.toBeCalled();
      });
    });
  });

  describe("validation", () => {
    it.each([-3, 3])("should throw if the action is not in [-1, 0, 1]", (action) => {
      expect(() => voteValidation({ action })).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "action", message: "action is invalid" }],
        }),
      );
    });
  });
});
