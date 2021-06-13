import { MutationReviewArgs as TArgs, AsyncResolver } from "@@components";
import { IDefinitionDocument as R } from "@Definition/Definition";

export const review: AsyncResolver<TArgs, R | null> = async (_, { id }, { dataSources }) => {
  return dataSources.definition.review(id);
};
