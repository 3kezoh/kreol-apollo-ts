import { AsyncResolver, QueryVoteArgs as TArgs } from "@@components";
import { IVoteDocument as R } from "@Vote/Vote";

export const vote: AsyncResolver<TArgs, R | null> = async (_, { definition }, { dataSources }) => {
  return dataSources.vote.get(definition);
};
