import { QueryReportArgs, Resolver } from "@@components";
import { IReportDocument } from "@Report/Report";
import { IUserDocument } from "@User";

export const report: Resolver<QueryReportArgs, IReportDocument | null> = async (
  _,
  { definition },
  { user: reporter, dataSources },
) => {
  return dataSources.report.get(definition, (reporter as IUserDocument)._id);
};
