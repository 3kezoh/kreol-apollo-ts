import { QueryReportsArgs as TArgs, AsyncResolver } from "@@components";
import { IReportDocument as R } from "@Report/Report";

export const reports: AsyncResolver<TArgs, R[] | null> = async (_, { definition }, { dataSources }) => {
  return dataSources.report.list(definition);
};
