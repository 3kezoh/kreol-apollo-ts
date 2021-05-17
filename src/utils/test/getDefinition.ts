import { Definition } from "@Definition";
import { getUser } from "@utils/test";

const getDefinition = async () => {
  const user = await getUser();
  return Definition.create({ word: "word", meaning: "meaning", example: "example", author: user });
};

export default getDefinition;
