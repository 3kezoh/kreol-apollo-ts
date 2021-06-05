import { MutationReportArgs, Resolver } from "@@api";
import { IReportDocument, reportValidation as validate } from "@Report";
import { IUserDocument } from "@User";
import { ApolloError } from "apollo-server-express";

export const report: Resolver<MutationReportArgs, IReportDocument> = async (
  _,
  { definition: id, reason, message },
  { user: reporter, dataSources },
) => {
  validate({ definition: id, reason, message });
  const definition = await dataSources.definition.get(id);
  if (!definition) throw new ApolloError("Definition Not Found");
  const hasReported = await dataSources.report.get(definition._id, (reporter as IUserDocument)._id);
  if (hasReported) throw new ApolloError("Already reported", undefined, { hasReported });
  return dataSources.report.create(definition._id, (reporter as IUserDocument)._id, reason, message);
};
