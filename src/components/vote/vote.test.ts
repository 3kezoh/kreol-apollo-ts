import { DEFINITION } from "@Definition/errors";
import { expectValidationErrors, mockedContext, mockedDefinition, mockedVote, setupMocks } from "@test";
import { ApolloError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";
import { ACTION } from "./errors";
import * as mutations from "./resolvers/mutations";
import * as queries from "./resolvers/queries";
import { validate } from "./validation";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");
jest.mock("@Vote/VoteDataSource");

setupMocks();

describe("Vote", () => {
  const definition = mockedDefinition.document._id.toHexString();

  const { get, remove, upsert } = mockedContext.dataSources.vote;
  const { get: _get, updateScore } = mockedContext.dataSources.definition;

  describe("queries", () => {
    describe("vote", () => {
      it("should resolve", async () => {
        mocked(get).mockResolvedValue(null);
        const vote = await queries.vote(null, { definition }, mockedContext, null);
        expect(get).toBeCalledWith(definition);
        expect(vote).toEqual(null);
      });

      it("should not throw because the definition id is invalid", async () => {
        mocked(get).mockResolvedValue(null);
        const vote = await queries.vote(null, { definition: "invalid id" }, mockedContext, null);
        expect(get).toBeCalledWith("invalid id");
        expect(vote).toEqual(null);
      });
    });
  });

  describe("mutations", () => {
    describe("vote", () => {
      it.each([
        [-1, mockedVote(-1)],
        [1, mockedVote(1)],
        [0, mockedVote(-1)],
      ])("should resolve when the action is %d", async (action, voteDocument) => {
        mocked(_get).mockResolvedValue(mockedDefinition.document);
        mocked(get).mockResolvedValueOnce(null);
        mocked(upsert).mockResolvedValue(voteDocument);
        let vote = await mutations.vote(null, { definition, action }, mockedContext, null);
        expect(_get).toBeCalledWith(definition);
        expect(get).toBeCalledWith(definition);
        if (action !== 0) {
          expect(updateScore).toBeCalledWith(definition, action);
          expect(upsert).toBeCalledWith(definition, action);
          expect(vote).toEqual(voteDocument);
        }
        mocked(get).mockResolvedValueOnce(voteDocument);
        mocked(remove).mockResolvedValueOnce(voteDocument);
        vote = await mutations.vote(null, { definition, action }, mockedContext, null);
        if (action === 0) {
          expect(remove).toBeCalledWith(definition);
          expect({ ...voteDocument, action: 0 });
        }
      });

      it("should throw if the definition is not found", async () => {
        mocked(_get).mockResolvedValue(null);
        await expect(mutations.vote(null, { definition, action: 0 }, mockedContext, null)).rejects.toThrow(
          new ApolloError(DEFINITION.NOT_FOUND),
        );
        expect(get).not.toBeCalled();
        expect(updateScore).not.toBeCalled();
        expect(remove).not.toBeCalled();
        expect(upsert).not.toBeCalled();
      });
    });
  });

  describe("validation", () =>
    it.each([-3, 3])("should throw if the action is not in [-1, 0, 1]", (action) =>
      expectValidationErrors({ action: ACTION.INVALID }, () => validate(action)),
    ));
});
