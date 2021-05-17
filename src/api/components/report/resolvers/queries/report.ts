import { QueryReportArgs, Resolver } from "@@api";
import { IReportDocument, Report } from "@Report";
import { report as validate } from "@Report/validations/queries";

const report: Resolver<QueryReportArgs, IReportDocument | null> = async (
  _,
  { definition },
  { user: reporter },
) => {
  validate({ definition });
  const report = Report.findOne({ reporter: reporter?._id, definition })
    .populate("reporter")
    .populate({ path: "definition", populate: { path: "author" } });
  return report;
};

export default report;
