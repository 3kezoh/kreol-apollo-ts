import { MutationCreateDefinitionArgs } from "@@api";
import { IDefinitionDocument } from "@Definition";
import { mockedContext } from "@test";
import { ObjectId } from "mongodb";

const args: MutationCreateDefinitionArgs = {
  word: "word",
  meaning: "meaning",
  example: "example",
  language: "fr",
};

const document = ({
  _id: new ObjectId(),
  ...args,
  score: 0,
  createdAt: new Date(),
  author: mockedContext.user,
  reviewed: false,
} as unknown) as IDefinitionDocument;

const mockedDefinition = { args, document };

export default mockedDefinition;
