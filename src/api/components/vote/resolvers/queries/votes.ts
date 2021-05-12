import { Resolver } from "@@api";
import { IVoteDocument, Vote } from "@Vote";

const votes: Resolver<null, IVoteDocument[] | null> = async (_, _args, { user: voter }) => {
  return Vote.find({ voter: voter._id }).populate("voter definition");
};

export default votes;
