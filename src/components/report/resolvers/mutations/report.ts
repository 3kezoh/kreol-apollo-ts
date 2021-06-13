import { MutationReportArgs as TArgs, AsyncResolver } from "@@components";
import { IReportDocument as R } from "@Report/Report";
import { validate } from "@Report/validation";
import { IUserDocument } from "@User";
import { ApolloError } from "apollo-server-express";

export const report: AsyncResolver<TArgs, R> = async (
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