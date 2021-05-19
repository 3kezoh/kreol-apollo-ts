import { ObjectId } from "mongodb";
import { mockedUser } from "@utils/test";
import { IDefinitionDocument } from "@api/components/definition";

const mockedDefinition = {
  word: "word",
  meaning: "meaning",
  example: "example",
  language: "fr",
};

const mockedDefinitionDocument = ({
  _id: new ObjectId(),
  ...mockedDefinition,
  score: 0,
  createdAt: new Date(),
  author: mockedUser,
} as unknown) as IDefinitionDocument;

export { mockedDefinition, mockedDefinitionDocument };
