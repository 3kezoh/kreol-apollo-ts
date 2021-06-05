import { QueryReportArgs, Resolver } from "@@api";
import { IReportDocument } from "@Report";
import { IUserDocument } from "@User";

export const report: Resolver<QueryReportArgs, IReportDocument | null> = async (
  _,
  { definition },
  { user: reporter, dataSources },
) => {
  return dataSources.report.get(definition, (reporter as IUserDocument)._id);
};
