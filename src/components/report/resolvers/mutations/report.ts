import { AsyncResolver, MutationReportArgs as TArgs } from "@@components";
import { DEFINITION } from "@Definition/errors";
import { IReportDocument as R } from "@Report/Report";
import { validate } from "@Report/validation";
import { ApolloError } from "apollo-server-express";

/**
 * @resolver
 * @throws if the definition is not found
 * @throws if the definition has already been reported
 */

export const report: AsyncResolver<TArgs, R | null> = async (_, args, { dataSources }) => {
  const { definition: id, reason, message } = args;
  validate(args);
  const definition = await dataSources.definition.get(id);
  if (!definition) throw new ApolloError(DEFINITION.NOT_FOUND);
  const hasReported = await dataSources.report.get(id);
  if (hasReported) throw new ApolloError(DEFINITION.ALREADY_REPORTED, undefined, { hasReported });
  return dataSources.report.create(id, reason, message);
};
