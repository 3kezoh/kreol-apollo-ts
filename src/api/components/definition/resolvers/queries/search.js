const Definition = require("../../Definition");
const { search: validate } = require("../../validations/queries");

const DEFINITIONS_PER_PAGE = 5;

const search = async (_, { match, page = 1, limit = DEFINITIONS_PER_PAGE }) => {
  validate({ limit });

  const result = await Definition.aggregate([
    { $sort: { score: -1, createdAt: 1 } },
    { $match: { word: new RegExp(`^${match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") } },
    { $group: { _id: "$word", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $addFields: { id: "$_id" } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  return Definition.populate(result, { path: "author" });
};

module.exports = search;
