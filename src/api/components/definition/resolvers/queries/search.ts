import { Definition, IDefinitionDocument } from "@Definition";
import { search as validate } from "@Definition/validations/queries";
import { Resolver, QuerySearchArgs } from "@@api";

const DEFINITIONS_PER_PAGE = 5;

const search: Resolver<QuerySearchArgs, IDefinitionDocument[]> = async (_, { match, page, limit }) => {
  page = page ?? 1;
  limit = limit ?? DEFINITIONS_PER_PAGE;
  validate({ limit });

  const definitions: IDefinitionDocument[] = await Definition.aggregate([
    { $match: { word: new RegExp(`^${match?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") } },
    { $sort: { score: -1, createdAt: 1 } },
    { $group: { _id: "$word", doc: { $first: "$$ROOT" } } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    { $replaceRoot: { newRoot: "$doc" } },
    { $set: { id: "$_id" } },
  ]);

  return Definition.populate(definitions, { path: "author" });
};

export default search;
