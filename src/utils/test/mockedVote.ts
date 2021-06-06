import { IVoteDocument } from "@Vote";
import { ObjectId } from "mongodb";
import { mockedContext } from "./mockedContext";
import { mockedDefinition } from "./mockedDefinition";

export const mockedVote = (action: number) =>
  (({
    _id: new ObjectId(),
    definition: mockedDefinition.document,
    action,
    voter: mockedContext.user,
    createdAt: new Date(),
  } as unknown) as IVoteDocument);
