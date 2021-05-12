import { QueryReportsArgs, Resolver } from "@@api";
import { IReportDocument, Report } from "@Report";
import { reports as validate } from "@Report/validations/queries";

const reports: Resolver<QueryReportsArgs, IReportDocument[]> = async (_, { definition }) => {
  validate({ definition });
  const reports = Report.find({ definition }).populate("reporter definition ");
  return reports;
};

export default reports;
