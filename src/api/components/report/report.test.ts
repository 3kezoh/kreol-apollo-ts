import { reportValidation } from "@Report";
import mutations from "@Report/resolvers/mutations";
import queries from "@Report/resolvers/queries";
import { mockedContext, mockedDefinition, mockedReport, mockedUser, setupMocks } from "@test";
import { ApolloError, UserInputError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");
jest.mock("@Report/ReportDataSource");

setupMocks();

describe("Definition", () => {
  const { reason, message } = mockedReport.args;
  const definition = mockedDefinition.document._id.toHexString();
  const definitionId = mockedDefinition.document._id;
  const reporterId = mockedUser._id;

  const { get, create, remove, list } = mockedContext.dataSources.report;
  const { get: _get } = mockedContext.dataSources.definition;

  describe("queries", () => {
    describe("report", () => {
      it("should resolve", async () => {
        mocked(get).mockResolvedValue(null);
        const report = await queries.report(null, { definition }, mockedContext, null);
        expect(get).toBeCalledWith(definition, mockedUser._id);
        expect(report).toEqual(null);
      });
    });

    describe("reports", () => {
      it("should resolve", async () => {
        mocked(list).mockResolvedValue([]);
        const report = await queries.reports(null, { definition }, mockedContext, null);
        expect(list).toBeCalledWith(definition);
        expect(report).toEqual([]);
      });
    });
  });

  describe("mutations", () => {
    describe("report", () => {
      it("should resolve", async () => {
        mocked(create).mockResolvedValue(mockedReport.document);
        mocked(_get).mockResolvedValue(mockedDefinition.document);
        const report = await mutations.report(null, mockedReport.args, mockedContext, null);
        expect(create).toBeCalledWith(definitionId, reporterId, reason, message);
        expect(report).toEqual(mockedReport.document);
      });

      it("should throw if the definition is not found", async () => {
        mocked(_get).mockResolvedValue(null);
        await expect(mutations.report(null, mockedReport.args, mockedContext, null)).rejects.toThrow(
          new ApolloError("Definition Not Found"),
        );
        expect(create).not.toBeCalled();
      });

      it("should throw if the report already exists", async () => {
        mocked(get).mockResolvedValue(mockedReport.document);
        mocked(_get).mockResolvedValue(mockedDefinition.document);
        await expect(mutations.report(null, mockedReport.args, mockedContext, null)).rejects.toThrow(
          new ApolloError("Already reported", undefined, { hasReported: mockedReport.document }),
        );
        expect(create).not.toBeCalled();
      });
    });
  });

  describe("validation", () => {
    it("should throw if the reason is not in [0, 1, 2, 3]", () => {
      mockedReport.args.reason = -3;
      expect(() => reportValidation(mockedReport.args)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "reason", message: "reason is invalid" }],
        }),
      );
    });

    it("should throw if the message greater than 500", () => {
      mockedReport.args.message = "#".repeat(503);
      expect(() => reportValidation(mockedReport.args)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "message", message: "message is too long" }],
        }),
      );
    });
  });
});
