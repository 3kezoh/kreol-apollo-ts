import { QueryReportArgs as TArgs, Resolver } from "@@components";
import { IReportDocument as R } from "@Report/Report";
import { IUserDocument } from "@User";

export const report: Resolver<TArgs, R | null> = async (
  _,
  { definition },
  { user: reporter, dataSources },
) => {
  return dataSources.report.get(definition, (reporter as IUserDocument)._id);
};
