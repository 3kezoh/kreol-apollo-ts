import { QueryReportsArgs, Resolver } from "@@api";
import { IReportDocument } from "@Report";

export const reports: Resolver<QueryReportsArgs, IReportDocument[] | null> = async (
  _,
  { definition },
  { dataSources },
) => {
  return dataSources.report.list(definition);
};
