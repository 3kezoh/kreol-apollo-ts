import { ApolloError } from "apollo-server-express";
import { Definition, IDefinitionDocument } from "@Definition";
import { User } from "@User";
import { definitions as validate } from "@Definition/validations/queries";
import { Resolver, QueryDefinitionsArgs, Match } from "@@api";
import { escapeRegExp } from "@utils";

const DEFINITIONS_PER_PAGE = 5;

const definitions: Resolver<QueryDefinitionsArgs, IDefinitionDocument[]> = async (
  _,
  { filter, page, limit },
  { user },
) => {
  const match: Match = {};
  page = page ?? 1;
  limit = limit ?? DEFINITIONS_PER_PAGE;
  validate({ filter, page, limit });

  if (filter?.word) match.word = escapeRegExp(filter.word);

  if (filter?.author) {
    const user = await User.findById(filter.author);
    if (!user) throw new ApolloError("User Not Found");
    match.author = user._id;
  }

  const aggregate = Definition.aggregate([
    { $match: match },
    { $sort: match?.word ? { score: -1, createdAt: 1 } : { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    { $set: { id: "$_id" } },
  ]);

  if (user) {
    aggregate.append([
      {
        $lookup: {
          from: "votes",
          let: { definitionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$definition", "$$definitionId"] }, { $eq: ["$voter", user._id] }],
                },
              },
            },
          ],
          as: "vote",
        },
      },
      { $set: { vote: { $first: "$vote" } } },
      { $set: { action: { $ifNull: ["$vote.action", 0] } } },
      { $project: { vote: 0 } },
    ]);
  }

  const definitions: IDefinitionDocument[] = await aggregate.exec();

  const d = Definition.populate(definitions, { path: "author" });

  return d;
};

export default definitions;
