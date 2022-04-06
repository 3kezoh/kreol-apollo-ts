import { IDefinitionDocument } from "@Definition";
import { ObjectId } from "mongodb";
import { mockedContext } from "./mockedContext";

const args = {
  word: "word",
  meaning: "meaning",
  example: "example",
  translation: "fr",
} as const;

const document = {
  _id: new ObjectId(),
  ...args,
  score: 0,
  createdAt: new Date(),
  author: mockedContext.user,
  reviewed: false,
} as unknown as IDefinitionDocument;

export const mockedDefinition = { args, document };
