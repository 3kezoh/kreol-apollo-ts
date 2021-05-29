import { QueryReportArgs, Resolver } from "@@api";
import { IUserDocument } from "@api/components/user";
import { IReportDocument } from "@Report";

const report: Resolver<QueryReportArgs, IReportDocument | null> = async (
  _,
  { definition },
  { user: reporter, dataSources },
) => {
  return dataSources.report.get(definition, (reporter as IUserDocument)._id);
};

export default report;
