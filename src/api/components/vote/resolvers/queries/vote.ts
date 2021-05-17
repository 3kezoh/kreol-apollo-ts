import { QueryVoteArgs, Resolver } from "@@api";
import { IVoteDocument, Vote } from "@Vote";
import { vote as validate } from "@Vote/validations/queries";

const vote: Resolver<QueryVoteArgs, IVoteDocument | null> = async (_, { definition }, { user: voter }) => {
  validate({ definition });
  return Vote.findOne({ voter: voter?._id, definition }).populate("voter definition");
};

export default vote;
