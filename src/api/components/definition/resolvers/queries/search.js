const Definition = require("../../Definition");

const DEFINITIONS_PER_PAGE = 5;

const search = async (_, { match, page = 1 }) => {
  const result = await Definition.aggregate([
    { $sort: { score: -1, createdAt: 1 } },
    { $match: { word: new RegExp(`^${match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") } },
    { $group: { _id: "$word", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $addFields: { id: "$_id" } },
    { $skip: (page - 1) * DEFINITIONS_PER_PAGE },
    { $limit: DEFINITIONS_PER_PAGE },
  ]);
  return Definition.populate(result, { path: "author" });
};

module.exports = search;
