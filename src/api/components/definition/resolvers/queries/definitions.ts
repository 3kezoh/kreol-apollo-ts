import { ApolloError } from "apollo-server-express";
import { model, Model } from "mongoose";
import { definitions as validate } from "@Definition/validations/queries";
import { IDefinition } from "@Definition";
import { IUser } from "@User";
import { escapeRegExp } from "@utils";
import { FieldResolver, QueryDefinitionsArgs } from "@@api/components/definitions";

const Definition: Model<IDefinition> = model("Definition");
const User: Model<IUser> = model("User");

const DEFINITIONS_PER_PAGE = 5;

const definitions: FieldResolver<QueryDefinitionsArgs> = async (_, { filter, page, limit }, { user }) => {
  filter = filter ?? {};
  page = page ?? 1;
  limit = limit ?? DEFINITIONS_PER_PAGE;
  validate({ filter, page, limit });

  if (filter?.word) (filter.word as unknown) = escapeRegExp(filter.word);

  if (filter?.author) {
    const user = await User.findById(filter.author);
    if (!user) throw new ApolloError("User Not Found");
    filter.author = user._id;
  }

  const aggregate = Definition.aggregate([
    { $match: filter },
    { $sort: filter?.word ? { score: -1, createdAt: 1 } : { createdAt: -1 } },
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

  const definitions = await aggregate.exec();

  return Definition.populate(definitions, { path: "author" });
};

export default definitions;
