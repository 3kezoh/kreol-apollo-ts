const { model } = require("mongoose");
const { search: validate } = require("@Definition/validations/queries");

const Definition = model("Definition");

const DEFINITIONS_PER_PAGE = 5;

const search = async (_, { match, page = 1, limit = DEFINITIONS_PER_PAGE }) => {
  validate({ limit });

  const result = await Definition.aggregate([
    { $match: { word: new RegExp(`^${match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") } },
    { $sort: { score: -1, createdAt: 1 } },
    { $group: { _id: "$word", doc: { $first: "$$ROOT" } } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    { $replaceRoot: { newRoot: "$doc" } },
    { $set: { id: "$_id" } },
  ]);

  return Definition.populate(result, { path: "author" });
};

module.exports = search;
