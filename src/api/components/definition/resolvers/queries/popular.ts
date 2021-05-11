import { Definition, IDefinitionDocument } from "@Definition";
import { popular as validate } from "@Definition/validations/queries";
import { Resolver, QueryPopularArgs, Match } from "@@api";

const DEFINITIONS_LIMIT = 50;

const popular: Resolver<QueryPopularArgs, IDefinitionDocument[]> = async (_, { letter, limit }) => {
  const match: Match = {};
  letter = letter ?? "a";
  limit = limit ?? DEFINITIONS_LIMIT;
  validate({ letter, limit });

  match.word = new RegExp(`^${letter}`, "i");

  const definitions: IDefinitionDocument[] = await Definition.aggregate([
    { $match: match },
    { $sort: { score: -1, createdAt: 1 } },
    { $group: { _id: "$word", score: { $sum: "$score" }, doc: { $first: "$$ROOT" } } },
    { $sort: { score: -1, createdAt: 1 } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $limit: limit },
    { $set: { id: "$_id" } },
  ]);

  return Definition.populate(definitions, { path: "author" });
};

export default popular;
