import { mockedContext, mockedDefinition } from "@test";
import { IVoteDocument } from "@Vote";
import { ObjectId } from "mongodb";

const mockedVote = (action: number) =>
  (({
    _id: new ObjectId(),
    definition: mockedDefinition.document,
    action,
    voter: mockedContext.user,
    createdAt: new Date(),
  } as unknown) as IVoteDocument);

export default mockedVote;
