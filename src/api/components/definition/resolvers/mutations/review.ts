import { MutationReviewArgs, Resolver } from "@@api";
import { IDefinitionDocument } from "@Definition";

const review: Resolver<MutationReviewArgs, IDefinitionDocument | null> = async (
  _,
  { id },
  { dataSources },
) => {
  return dataSources.definition.review(id);
};

export default review;
