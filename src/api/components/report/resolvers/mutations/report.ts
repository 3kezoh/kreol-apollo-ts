import { ApolloError } from "apollo-server-express";
import { IReportDocument, Report } from "@Report";
import { Definition } from "@Definition";
import { report as validate } from "@Report/validations/mutations";
import { Resolver, MutationReportArgs } from "@@api";

const report: Resolver<MutationReportArgs, IReportDocument> = async (
  _,
  { definition: id, reason, message },
  { user: reporter },
) => {
  validate({ definition: id, reason, message });
  const definition = await Definition.findById(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  const hasReported = await Report.findOne({ definition: definition._id, reporter: reporter?._id });
  if (hasReported) throw new ApolloError("Already reported", undefined, { hasReported });
  const report = await Report.create({ definition, reason, reporter, message });
  await report.populate("definition.author").execPopulate();
  return report;
};

export default report;
