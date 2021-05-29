import { Context, DataSourcesContext } from "@@api";
import { Definition, DefinitionDataSource } from "@Definition";
import { Report, ReportDataSource, reportValidation } from "@Report";
import mutations from "@Report/resolvers/mutations";
import queries from "@Report/resolvers/queries";
import { User, UserDataSource } from "@User";
import { mockedDefinitionDocument, mockedReport, mockedReportDocument, mockedUser } from "@utils/test";
import { Vote, VoteDataSource } from "@Vote";
import { ApolloError, UserInputError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");
jest.mock("@Report/ReportDataSource");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Definition", () => {
  const mockedContext: Context & DataSourcesContext = {
    dataSources: {
      definition: new DefinitionDataSource(Definition),
      user: new UserDataSource(User),
      vote: new VoteDataSource(Vote),
      report: new ReportDataSource(Report),
    },
    user: mockedUser,
  };

  const { reason, message } = mockedReport;
  const definition = mockedDefinitionDocument._id.toHexString();
  const definitionId = mockedDefinitionDocument._id;
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
        mocked(create).mockResolvedValue(mockedReportDocument);
        mocked(_get).mockResolvedValue(mockedDefinitionDocument);
        const report = await mutations.report(null, mockedReport, mockedContext, null);
        expect(create).toBeCalledWith(definitionId, reporterId, reason, message);
        expect(report).toEqual(mockedReportDocument);
      });

      it("should throw if the definition is not found", async () => {
        mocked(create).mockResolvedValue(mockedReportDocument);
        mocked(_get).mockResolvedValue(null);
        await expect(mutations.report(null, mockedReport, mockedContext, null)).rejects.toThrow(
          new ApolloError("Definition Not Found"),
        );
        expect(create).not.toBeCalled();
      });

      it("should throw if the report already exists", async () => {
        mocked(get).mockResolvedValue(mockedReportDocument);
        mocked(_get).mockResolvedValue(mockedDefinitionDocument);
        await expect(mutations.report(null, mockedReport, mockedContext, null)).rejects.toThrow(
          new ApolloError("Already reported", undefined, { hasReported: mockedReportDocument }),
        );
        expect(create).not.toBeCalled();
      });
    });
  });

  describe("validation", () => {
    it("should throw if the reason is not in [0, 1, 2, 3]", () => {
      mockedReport.reason = -3;
      expect(() => reportValidation(mockedReport)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "reason", message: "reason is invalid" }],
        }),
      );
    });

    it("should throw if the message greater than 500", () => {
      mockedReport.message = "#".repeat(503);
      expect(() => reportValidation(mockedReport)).toThrow(
        new UserInputError("Validation Error", {
          validationErrors: [{ field: "message", message: "message is too long" }],
        }),
      );
    });
  });
});
