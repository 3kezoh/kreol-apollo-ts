import { ObjectId } from "mongodb";
import { mockedContext } from "@test";
import { IDefinitionDocument } from "@api/components/definition";
import { MutationCreateDefinitionArgs } from "@@api";

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
