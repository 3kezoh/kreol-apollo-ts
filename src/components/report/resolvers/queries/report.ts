import { QueryReportArgs as TArgs, AsyncResolver } from "@@components";
import { IReportDocument as R } from "@Report/Report";
import { IUserDocument } from "@User";

export const report: AsyncResolver<TArgs, R | null> = async (
  _,
  { definition },
  { user: reporter, dataSources },
) => {
  return dataSources.report.get(definition, (reporter as IUserDocument)._id);
};
