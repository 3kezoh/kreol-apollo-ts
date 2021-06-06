import { QueryReportsArgs, Resolver } from "@@components";
import { IReportDocument } from "@Report/Report";

export const reports: Resolver<QueryReportsArgs, IReportDocument[] | null> = async (
  _,
  { definition },
  { dataSources },
) => {
  return dataSources.report.list(definition);
};
