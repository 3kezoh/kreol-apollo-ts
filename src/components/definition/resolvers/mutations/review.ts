import { MutationReviewArgs as TArgs, Resolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";

export const review: Resolver<TArgs, R | null> = async (_, { id }, { dataSources }) => {
  return dataSources.definition.review(id);
};
