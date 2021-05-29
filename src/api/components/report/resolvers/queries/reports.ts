import { QueryReportsArgs, Resolver } from "@@api";
import { IReportDocument } from "@Report";

const reports: Resolver<QueryReportsArgs, IReportDocument[] | null> = async (
  _,
  { definition },
  { dataSources },
) => {
  return dataSources.report.list(definition);
};

export default reports;
