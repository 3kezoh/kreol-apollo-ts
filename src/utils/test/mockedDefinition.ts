import { ObjectId } from "mongodb";
import { mockedUser } from "@utils/test";

const mockedDefinition = {
  _id: new ObjectId().toHexString(),
  word: "word",
  meaning: "meaning",
  example: "example",
  language: "fr",
  score: 0,
  createdAt: new Date(),
  author: mockedUser,
};

export default mockedDefinition;
