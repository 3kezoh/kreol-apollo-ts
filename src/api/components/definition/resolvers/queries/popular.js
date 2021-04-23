const Definition = require("../../Definition");
const { popular: validate } = require("../../validations/queries");

const DEFINITIONS_LIMIT = 50;

const popular = async (_, { letter, limit = DEFINITIONS_LIMIT }) => {
  validate({ letter, limit });

  const result = await Definition.aggregate([
    { $match: { word: new RegExp(`^${letter}`, "i") } },
    { $group: { _id: "$word", score: { $sum: "$score" }, doc: { $first: "$$ROOT" } } },
    { $sort: { score: -1, createdAt: 1 } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $addFields: { id: "$_id" } },
    { $limit: limit },
  ]);

  return Definition.populate(result, { path: "author" });
};

module.exports = popular;
