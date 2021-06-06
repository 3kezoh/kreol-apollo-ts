import { MutationReviewArgs, Resolver } from "@@components";
import { IDefinitionDocument } from "@Definition/Definition";

export const review: Resolver<MutationReviewArgs, IDefinitionDocument | null> = async (
  _,
  { id },
  { dataSources },
) => {
  return dataSources.definition.review(id);
};
