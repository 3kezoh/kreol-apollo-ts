import { IVoteDocument } from "@Vote";
import { mockedDefinition, mockedUser } from "@test";
import { ObjectId } from "mongodb";

const mockedVote = (action: number) =>
  (({
    _id: new ObjectId(),
    definition: mockedDefinition.document,
    action,
    voter: mockedUser,
    createdAt: new Date(),
  } as unknown) as IVoteDocument);

export default mockedVote;
