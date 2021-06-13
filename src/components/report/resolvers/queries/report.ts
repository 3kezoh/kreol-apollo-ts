import { AsyncResolver, QueryReportArgs as TArgs } from "@@components";
import { IReportDocument as R } from "@Report/Report";

export const report: AsyncResolver<TArgs, R | null> = async (_, { definition }, { dataSources }) => {
  return dataSources.report.get(definition);
};
