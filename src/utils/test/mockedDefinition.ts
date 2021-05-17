import { ObjectId } from "mongodb";
import { mockedUser } from "@utils/test";
import { IDefinitionDocument } from "@api/components/definition";

const mockedDefinition = ({
  _id: new ObjectId(),
  word: "word",
  meaning: "meaning",
  example: "example",
  language: "fr",
  score: 0,
  createdAt: new Date(),
  author: mockedUser,
} as unknown) as IDefinitionDocument;

export default mockedDefinition;
