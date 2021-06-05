import { QueryVoteArgs, Resolver } from "@@api";
import { IUserDocument } from "@User";
import { IVoteDocument } from "@Vote";

type voteResolver = Resolver<QueryVoteArgs, IVoteDocument | null>;

export const vote: voteResolver = async (_, { definition }, { user: voter, dataSources }) => {
  return dataSources.vote.get(definition, (voter as IUserDocument)._id);
};
