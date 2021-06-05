import { MutationReviewArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";

export const review: Resolver<MutationReviewArgs, IDefinitionDocument | null> = async (
  _,
  { id },
  { dataSources },
) => {
  return dataSources.definition.review(id);
};
