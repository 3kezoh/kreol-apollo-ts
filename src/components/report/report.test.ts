import { DEFINITION } from "@Definition/errors";
import { expectValidationErrors, mockedContext, mockedDefinition, mockedReport, setupMocks } from "@test";
import { ApolloError } from "apollo-server-express";
import { mocked } from "ts-jest/utils";
import { MESSAGE, REASON } from "./errors";
import * as mutations from "./resolvers/mutations";
import * as queries from "./resolvers/queries";
import { validate } from "./validation";

jest.mock("@Definition/DefinitionDataSource");
jest.mock("@User/UserDataSource");
jest.mock("@Report/ReportDataSource");

setupMocks();

describe("Report", () => {
  const { reason, message } = mockedReport.args;
  const definition = mockedDefinition.document._id.toHexString();

  const { get, create, remove, list } = mockedContext.dataSources.report;
  const { get: _get } = mockedContext.dataSources.definition;

  describe("queries", () => {
    describe("report", () => {
      it("should resolve", async () => {
        mocked(get).mockResolvedValue(null);
        const report = await queries.report(null, { definition }, mockedContext, null);
        expect(get).toBeCalledWith(definition);
        expect(report).toEqual(null);
      });

      it("should not throw if the id is invalid", async () => {
        mocked(get).mockResolvedValue(null);
        await expect(
          queries.report(null, { definition: "invalid id" }, mockedContext, null),
        ).resolves.not.toThrow();
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
        expect(_get).toBeCalledWith(definition);
        expect(get).toBeCalledWith(definition);
        expect(create).toBeCalledWith(definition, reason, message);
        expect(report).toEqual(mockedReport.document);
      });

      it("should throw if the definition is not found", async () => {
        mocked(_get).mockResolvedValue(null);
        await expect(mutations.report(null, mockedReport.args, mockedContext, null)).rejects.toThrow(
          new ApolloError(DEFINITION.NOT_FOUND),
        );
        expect(_get).toBeCalledWith(definition);
        expect(get).not.toBeCalled();
        expect(create).not.toBeCalled();
      });

      it("should throw if the report already exists", async () => {
        mocked(get).mockResolvedValue(mockedReport.document);
        mocked(_get).mockResolvedValue(mockedDefinition.document);
        await expect(mutations.report(null, mockedReport.args, mockedContext, null)).rejects.toThrow(
          new ApolloError(DEFINITION.ALREADY_REPORTED, undefined, { hasReported: mockedReport.document }),
        );
        expect(_get).toBeCalledWith(definition);
        expect(get).toBeCalledWith(definition);
        expect(create).not.toBeCalled();
      });
    });
  });

  describe("validation", () => {
    it("should throw if the reason is not in [0, 1, 2, 3]", () =>
      expectValidationErrors({ reason: REASON.INVALID }, () =>
        validate({ ...mockedReport.args, reason: -3 }),
      ));

    it("should throw if the reason is 3 and message is empty", () =>
      expectValidationErrors({ message: [MESSAGE.EMPTY] }, () =>
        validate({ ...mockedReport.args, reason: 3, message: "" }),
      ));

    it("should throw if the message greater than 300", () =>
      expectValidationErrors({ message: [MESSAGE.TOO_LONG] }, () =>
        validate({ ...mockedReport.args, message: "m".repeat(303) }),
      ));
  });
});
