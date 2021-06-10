import { QueryReportsArgs as TArgs, Resolver } from "@@components";
import { IReportDocument as R } from "@Report/Report";

export const reports: Resolver<TArgs, R[] | null> = async (_, { definition }, { dataSources }) => {
  return dataSources.report.list(definition);
};
