const { ApolloError } = require("apollo-server-express");
const { model } = require("mongoose");
const { definitions: validate } = require("@Definition/validations/queries");
const { escapeRegExp } = require("@utils");

const Definition = model("Definition");
const User = model("User");

const DEFINITIONS_PER_PAGE = 5;

const definitions = async (_, { filter, page = 1, limit = DEFINITIONS_PER_PAGE }, { user }) => {
  validate({ filter, page });
  const conditions = { ...(filter || {}) };

  if (conditions?.word) conditions.word = escapeRegExp(conditions.word);

  if (conditions?.author) {
    const user = await User.findById(conditions.author);
    if (!user) throw new ApolloError("User Not Found");
  }

  if (user && conditions?.author) {
    const definitions = await Definition.aggregate([
      { $sort: conditions?.word ? { score: -1, createdAt: 1 } : { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $match: conditions },
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
      { $set: { id: "$_id", action: { $ifNull: ["$vote.action", 0] } } },
      { $project: { vote: 0 } },
    ]);

    return Definition.populate(definitions, { path: "author" });
  }

  const definitions = await Definition.find(conditions)
    .sort(conditions?.word ? "-score createdAt" : "-createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author");

  return definitions;
};

module.exports = definitions;
